export const COLORS = {
  driver: 'bg-purple-600',
  worker: 'bg-slate-800',
  storage: 'bg-slate-400',
  partitionPending: 'bg-slate-300',
  partitionProcessing: 'bg-blue-500',
  partitionRam: 'bg-emerald-500',
  partitionDisk: 'bg-amber-500',
  partitionCompleted: 'bg-slate-900',
};

export const DEFAULT_CONFIG = {
  totalDataMB: 200,
  partitionSizeMB: 20,
  workerCount: 3,
  workerRamMB: 60, // Intentionally small to force spill
  workerCores: 2,
  speedMs: 800, // Slower default for better visibility
};