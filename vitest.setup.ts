import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import React from 'react';

afterEach(() => cleanup());

// Mock framer-motion: strip animations for clean jsdom test output.
// AnimatePresence accumulates exiting elements; this mock makes it a pass-through.
vi.mock('framer-motion', () => {
  const makeMotionComponent = (tag: string) => {
    const Comp = ({
      children,
      className,
      onClick,
      style,
      ...props
    }: Record<string, unknown>) => {
      const clean: Record<string, unknown> = {};
      if (className) clean.className = className as string;
      if (onClick) clean.onClick = onClick as (e: unknown) => void;
      if (style) clean.style = style as Record<string, unknown>;
      // Pass through standard HTML attributes for testing
      for (const key of Object.keys(props)) {
        if (
          key.startsWith('aria-') ||
          key.startsWith('data-') ||
          key === 'disabled' ||
          key === 'role' ||
          key === 'type' ||
          key === 'id' ||
          key === 'placeholder' ||
          key === 'rows' ||
          key === 'maxLength' ||
          key === 'name' ||
          key === 'value'
        ) {
          clean[key] = props[key];
        }
      }
      return React.createElement(tag, clean, children as React.ReactNode);
    };
    Comp.displayName = `motion.${tag}`;
    return Comp;
  };

  const motion = new Proxy({} as Record<string, unknown>, {
    get: (_t, tag: string) => makeMotionComponent(tag),
  });

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    // Re-export other framer-motion utilities that components may import
    useAnimation: () => ({}),
    useMotionValue: (v: unknown) => ({ get: () => v, set: () => {} }),
    useTransform: (v: unknown) => v,
  };
});
