import { useState, useCallback, useRef, useEffect } from 'react';
import type { ComponentCategory } from '../types';

export type AssemblyPhase = 'idle' | 'playing' | 'paused' | 'complete';

export interface AssemblyStep {
  category: ComponentCategory;
  label: string;
  icon: string;
  duration: number;
}

/** Fixed assembly order — matches real PC building */
const ASSEMBLY_ORDER: AssemblyStep[] = [
  { category: 'case', label: 'Place Case', icon: '🖥️', duration: 1200 },
  { category: 'psu', label: 'Install PSU', icon: '⚡', duration: 1400 },
  { category: 'motherboard', label: 'Mount Motherboard', icon: '🔲', duration: 1800 },
  { category: 'cpu', label: 'Seat CPU', icon: '🧠', duration: 1200 },
  { category: 'cooling', label: 'Attach Cooler', icon: '❄️', duration: 2000 },
  { category: 'ram', label: 'Insert RAM', icon: '📊', duration: 1000 },
  { category: 'storage', label: 'Install Storage', icon: '💾', duration: 1000 },
  { category: 'gpu', label: 'Seat GPU', icon: '🎮', duration: 1800 },
];

export interface AssemblyState {
  phase: AssemblyPhase;
  steps: AssemblyStep[];
  currentStepIndex: number;
  /** 0-1 progress within the current step */
  stepProgress: number;
  /** Categories visible so far */
  visibleCategories: Set<ComponentCategory>;
  /** Category currently being animated */
  activeCategory: ComponentCategory | null;
}

export interface AssemblyControls {
  play: () => void;
  pause: () => void;
  reset: () => void;
  nextStep: () => void;
  prevStep: () => void;
  jumpTo: (index: number) => void;
}

export function useAssemblyAnimation(
  availableCategories: ComponentCategory[]
): [AssemblyState, AssemblyControls] {
  const steps = ASSEMBLY_ORDER.filter((s) => availableCategories.includes(s.category));

  const [phase, setPhase] = useState<AssemblyPhase>('idle');
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [stepProgress, setStepProgress] = useState(0);

  const startTimeRef = useRef(0);
  const rafRef = useRef(0);

  // Compute visible categories based on current step
  const visibleCategories = new Set<ComponentCategory>();
  if (phase === 'idle') {
    // Show everything when idle
    availableCategories.forEach((c) => visibleCategories.add(c));
  } else {
    // Show only installed components + the one currently animating
    for (let i = 0; i <= currentStepIndex && i < steps.length; i++) {
      visibleCategories.add(steps[i].category);
    }
  }

  const activeCategory =
    phase === 'playing' && currentStepIndex >= 0 && currentStepIndex < steps.length
      ? steps[currentStepIndex].category
      : null;

  // Animation loop
  const animate = useCallback(() => {
    if (currentStepIndex < 0 || currentStepIndex >= steps.length) return;

    const elapsed = performance.now() - startTimeRef.current;
    const duration = steps[currentStepIndex].duration;
    const progress = Math.min(elapsed / duration, 1);

    setStepProgress(progress);

    if (progress >= 1) {
      // Step complete — advance
      const nextIdx = currentStepIndex + 1;
      if (nextIdx < steps.length) {
        setCurrentStepIndex(nextIdx);
        startTimeRef.current = performance.now();
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPhase('complete');
      }
    } else {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [currentStepIndex, steps]);

  // Start/resume animation when phase changes to playing
  useEffect(() => {
    if (phase === 'playing') {
      startTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, animate]);

  const play = useCallback(() => {
    if (phase === 'idle' || phase === 'complete') {
      setCurrentStepIndex(0);
      setStepProgress(0);
    }
    setPhase('playing');
  }, [phase]);

  const pause = useCallback(() => {
    if (phase === 'playing') {
      cancelAnimationFrame(rafRef.current);
      setPhase('paused');
    }
  }, [phase]);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setPhase('idle');
    setCurrentStepIndex(-1);
    setStepProgress(0);
  }, []);

  const nextStep = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const next = Math.min(currentStepIndex + 1, steps.length - 1);
    setCurrentStepIndex(next);
    setStepProgress(1);
    if (next === steps.length - 1) setPhase('complete');
    else setPhase('paused');
  }, [currentStepIndex, steps.length]);

  const prevStep = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const prev = Math.max(currentStepIndex - 1, 0);
    setCurrentStepIndex(prev);
    setStepProgress(1);
    setPhase('paused');
  }, [currentStepIndex]);

  const jumpTo = useCallback(
    (index: number) => {
      cancelAnimationFrame(rafRef.current);
      const clamped = Math.max(0, Math.min(index, steps.length - 1));
      setCurrentStepIndex(clamped);
      setStepProgress(1);
      if (clamped >= steps.length - 1) setPhase('complete');
      else setPhase('paused');
    },
    [steps.length]
  );

  return [
    { phase, steps, currentStepIndex, stepProgress, visibleCategories, activeCategory },
    { play, pause, reset, nextStep, prevStep, jumpTo },
  ];
}
