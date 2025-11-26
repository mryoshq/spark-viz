export enum SparkComponentType {
  DRIVER = 'Driver',
  SPARK_SESSION = 'SparkSession',
  CLUSTER_MANAGER = 'Cluster Manager',
  WORKER = 'Worker Node',
  EXECUTOR = 'Executor',
  TASK = 'Task',
  CACHE = 'Cache/BlockManager',
  USER_CODE = 'User Code'
}

export interface StepDefinition {
  id: number;
  title: string;
  description: string;
  activeComponents: SparkComponentType[];
  highlightEdges: string[]; // e.g., "driver-cm"
  animationType?: 'request' | 'allocate' | 'dispatch' | 'result';
}

export interface ExplainResponse {
  text: string;
}
