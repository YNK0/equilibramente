// Client-side analysis trigger — coordinates refetch after mutations
// Database triggers handle the server-side Edge Function call.
// This module provides client-side invalidation so UI updates immediately.

type MutationCallback = () => void;

const analysisListeners = new Set<MutationCallback>();
const dataChangeListeners = new Set<MutationCallback>();

export function onAnalysisNeedsRefresh(cb: MutationCallback): () => void {
  analysisListeners.add(cb);
  return () => analysisListeners.delete(cb);
}

export function triggerAnalysisRefresh(): void {
  for (const cb of analysisListeners) cb();
}

export function onDataChanged(cb: MutationCallback): () => void {
  dataChangeListeners.add(cb);
  return () => dataChangeListeners.delete(cb);
}

export function triggerDataChanged(): void {
  for (const cb of dataChangeListeners) cb();
  triggerAnalysisRefresh();
}
