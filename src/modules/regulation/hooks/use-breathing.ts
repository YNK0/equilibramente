'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { BREATHING_PATTERNS } from '../constants';
import type { BreathingPatternKey, BreathingPhase } from '../types';

interface UseBreathingResult {
  phase: BreathingPhase;
  cycle: number;
  totalCycles: number;
  progress: number;
  overallProgress: number;
  isActive: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  elapsedSeconds: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function useBreathing(patternKey: BreathingPatternKey): UseBreathingResult {
  const pattern = BREATHING_PATTERNS[patternKey];

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const activeRef = useRef(false);
  const animFrameRef = useRef(0);
  const phaseStartRef = useRef(0);
  const exerciseStartRef = useRef(0);
  const phaseIndexRef = useRef(0);
  const cycleRef = useRef(1);

  const currentPhase = pattern.phases[phaseIndex];

  const animate = useCallback((timestamp: number) => {
    if (!phaseStartRef.current) phaseStartRef.current = timestamp;
    if (!exerciseStartRef.current) exerciseStartRef.current = timestamp;

    const phaseElapsed = (timestamp - phaseStartRef.current) / 1000;
    const currentDuration = pattern.phases[phaseIndexRef.current]?.duration ?? 1;
    const phaseProgress = Math.min(phaseElapsed / currentDuration, 1);

    setProgress(phaseProgress);
    setElapsedSeconds((timestamp - exerciseStartRef.current) / 1000);

    if (phaseProgress >= 1) {
      phaseStartRef.current = timestamp;
      const nextIdx = phaseIndexRef.current + 1;

      if (nextIdx >= pattern.phases.length) {
        const nextCycle = cycleRef.current + 1;
        if (nextCycle > pattern.cycles) {
          activeRef.current = false;
          setIsActive(false);
          setIsCompleted(true);
          return;
        }
        cycleRef.current = nextCycle;
        phaseIndexRef.current = 0;
        setCycle(nextCycle);
        setPhaseIndex(0);
      } else {
        phaseIndexRef.current = nextIdx;
        setPhaseIndex(nextIdx);
      }
    }

    if (activeRef.current) {
      animFrameRef.current = requestAnimationFrame(animate);
    }
  }, [pattern]);

  const start = useCallback(() => {
    activeRef.current = true;
    phaseIndexRef.current = 0;
    cycleRef.current = 1;
    setIsActive(true);
    setIsPaused(false);
    setIsCompleted(false);
    setPhaseIndex(0);
    setCycle(1);
    setProgress(0);
    setElapsedSeconds(0);
    phaseStartRef.current = 0;
    exerciseStartRef.current = 0;
    animFrameRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const pause = useCallback(() => {
    activeRef.current = false;
    setIsActive(false);
    setIsPaused(true);
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  const resume = useCallback(() => {
    activeRef.current = true;
    setIsActive(true);
    setIsPaused(false);
    phaseStartRef.current = performance.now() - (progress * currentPhase.duration * 1000);
    animFrameRef.current = requestAnimationFrame(animate);
  }, [animate, progress, currentPhase.duration]);

  const stop = useCallback(() => {
    activeRef.current = false;
    setIsActive(false);
    setIsPaused(false);
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const totalPhases = pattern.phases.length * pattern.cycles;
  const completedPhases = (cycle - 1) * pattern.phases.length + phaseIndex;
  const overallProgress = totalPhases > 0 ? (completedPhases + progress) / totalPhases : 0;

  return {
    phase: currentPhase,
    cycle,
    totalCycles: pattern.cycles,
    progress,
    overallProgress,
    isActive,
    isPaused,
    isCompleted,
    elapsedSeconds,
    start,
    pause,
    resume,
    stop,
  };
}
