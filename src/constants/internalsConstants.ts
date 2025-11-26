import { SparkComponentType, StepDefinition } from '../types/internalsTypes';

export const SPARK_STEPS: StepDefinition[] = [
  {
    id: 0,
    title: "Idle System",
    description: "The Spark cluster is provisioned. The Driver is ready, and the Cluster Manager is waiting for resource requests.",
    activeComponents: [SparkComponentType.CLUSTER_MANAGER],
    highlightEdges: []
  },
  {
    id: 1,
    title: "User Code Submission",
    description: "User code (e.g., Python/Scala) initiates a SparkContext/SparkSession. Transformations are recorded, but nothing runs until an Action is called.",
    activeComponents: [SparkComponentType.USER_CODE, SparkComponentType.DRIVER, SparkComponentType.SPARK_SESSION],
    highlightEdges: ['user-driver']
  },
  {
    id: 2,
    title: "DAG Construction",
    description: "The Driver's DAG Scheduler converts the logical plan into a physical execution plan (Stages and Tasks) based on data locality and shuffle dependencies.",
    activeComponents: [SparkComponentType.DRIVER],
    highlightEdges: [],
    animationType: 'request'
  },
  {
    id: 3,
    title: "Resource Request",
    description: "The Driver negotiates with the Cluster Manager (YARN, K8s, Standalone) to acquire resources (containers) for Executors.",
    activeComponents: [SparkComponentType.DRIVER, SparkComponentType.CLUSTER_MANAGER],
    highlightEdges: ['driver-cm'],
    animationType: 'request'
  },
  {
    id: 4,
    title: "Executor Allocation",
    description: "The Cluster Manager launches Executors on Worker Nodes. These Executors register themselves back with the Driver.",
    activeComponents: [SparkComponentType.CLUSTER_MANAGER, SparkComponentType.WORKER, SparkComponentType.EXECUTOR],
    highlightEdges: ['cm-worker1', 'cm-worker2'],
    animationType: 'allocate'
  },
  {
    id: 5,
    title: "Task Scheduling",
    description: "The Task Scheduler (in Driver) sends serialized Tasks to the Executors. It tries to send tasks to where the data resides (Data Locality).",
    activeComponents: [SparkComponentType.DRIVER, SparkComponentType.EXECUTOR, SparkComponentType.TASK],
    highlightEdges: ['driver-exec1', 'driver-exec2'],
    animationType: 'dispatch'
  },
  {
    id: 6,
    title: "Task Execution & Caching",
    description: "Executors run the tasks in thread pools. Intermediate results may be stored in Cache/BlockManager (Memory/Disk).",
    activeComponents: [SparkComponentType.EXECUTOR, SparkComponentType.TASK, SparkComponentType.CACHE],
    highlightEdges: [],
    animationType: 'allocate' // Internal movement
  },
  {
    id: 7,
    title: "Result Aggregation",
    description: "Completed tasks return results (or status) to the Driver. If it's an action like `collect()`, data flows back.",
    activeComponents: [SparkComponentType.EXECUTOR, SparkComponentType.DRIVER],
    highlightEdges: ['exec1-driver', 'exec2-driver'],
    animationType: 'result'
  }
];
