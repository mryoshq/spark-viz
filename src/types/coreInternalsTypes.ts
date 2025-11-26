export enum NodeType {
  DRIVER = 'DRIVER',
  WORKER = 'WORKER',
  STORAGE = 'STORAGE'
}

export enum PartitionState {
  PENDING = 'PENDING',
  IN_FLIGHT = 'IN_FLIGHT',
  PROCESSING = 'PROCESSING',
  CACHED_RAM = 'CACHED_RAM',
  CACHED_DISK = 'CACHED_DISK',
  COMPLETED = 'COMPLETED'
}

export interface Partition {
  id: number;
  sizeMB: number;
  state: PartitionState;
  workerId: number | null; // Assigned worker
  progress: number; // 0 to 100
}

export interface WorkerNode {
  id: number;
  name: string;
  cores: number;
  activeTasks: number;
  ramTotalMB: number;
  ramUsedMB: number;
  diskUsedMB: number;
  partitionsInRam: number[];
  partitionsInDisk: number[];
}

export interface SimulationConfig {
  totalDataMB: number;
  partitionSizeMB: number;
  workerCount: number;
  workerRamMB: number;
  workerCores: number;
  speedMs: number;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
}