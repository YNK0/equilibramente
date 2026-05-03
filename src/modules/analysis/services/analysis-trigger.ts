// Client-side analysis trigger — coordinates refetch after mutations
// Database triggers handle the server-side Edge Function call.
// This module provides client-side invalidation so UI updates immediately.

type AnalysisCallback = () => void;

const listeners = new Set<AnalysisCallback>();

export function onAnalysisNeedsRefresh(cb: AnalysisCallback): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function triggerAnalysisRefresh(): void {
  for (const cb of listeners) {
    cb();
  }
}
