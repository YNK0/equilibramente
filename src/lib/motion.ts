import type { Variants, Transition } from 'framer-motion';

export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const pageTransition: Transition = {
  duration: 0.2,
  ease: 'easeOut',
};

export const cardStagger: Variants = {
  visible: { transition: { staggerChildren: 0.05 } },
};

export const cardItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export const tapScale = {
  whileTap: { scale: 0.95 },
};

export const toastAnimation: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
};

export const toastTransition: Transition = {
  duration: 0.2,
};

export const celebration: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.5 },
  },
};

export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
