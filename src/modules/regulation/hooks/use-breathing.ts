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

  const animFrameRef = useRef(0);
  const phaseStartRef = useRef(0);
  const exerciseStartRef = useRef(0);
  const pausedElapsedRef = useRef(0);
  const currentPhase = pattern.phases[phaseIndex];

  const animate = useCallback((timestamp: number) => {
    if (!phaseStartRef.current) phaseStartRef.current = timestamp;
    if (!exerciseStartRef.current) exerciseStartRef.current = timestamp;

    const elapsed = (timestamp - phaseStartRef.current) / 1000;
    const phaseProgress = Math.min(elapsed / currentPhase.duration, 1);
    setProgress(phaseProgress);
    setElapsedSeconds((timestamp - exerciseStartRef.current) / 1000);

    if (phaseProgress >= 1) {
      phaseStartRef.current = timestamp;
      const nextIdx = phaseIndex + 1;
      if (nextIdx >= pattern.phases.length) {
        const nextCycle = cycle + 1;
        if (nextCycle > pattern.cycles) {
          setIsActive(false);
          setIsCompleted(true);
          return;
        }
        setCycle(nextCycle);
        setPhaseIndex(0);
      } else {
        setPhaseIndex(nextIdx);
      }
    }

    if (isActive) {
      animFrameRef.current = requestAnimationFrame(animate);
    }
  }, [currentPhase, phaseIndex, cycle, pattern, isActive]);

  const start = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
    setIsCompleted(false);
    setPhaseIndex(0);
    setCycle(1);
    setProgress(0);
    setElapsedSeconds(0);
    phaseStartRef.current = 0;
    exerciseStartRef.current = 0;
    pausedElapsedRef.current = 0;
    animFrameRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const pause = useCallback(() => {
    setIsPaused(true);
    setIsActive(false);
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    setIsActive(true);
    phaseStartRef.current = performance.now() - (progress * currentPhase.duration * 1000);
    animFrameRef.current = requestAnimationFrame(animate);
  }, [animate, progress, currentPhase.duration]);

  const stop = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const totalPhases = pattern.phases.length * pattern.cycles;
  const completedPhases = (cycle - 1) * pattern.phases.length + phaseIndex;
  const overallProgress = (completedPhases + progress) / totalPhases;

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
