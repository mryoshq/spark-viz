export enum ConceptType {
    SHUFFLE = 'shuffle',
    DAG = 'dag',
    LAZY_EVAL = 'lazy_eval',
    DATA_LOCALITY = 'data_locality',
    FAULT_TOLERANCE = 'fault_tolerance',
    CATALYST = 'catalyst',
    NETWORK = 'network',
}

export interface Concept {
    id: ConceptType;
    title: string;
    description: string;
    icon: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Shuffle Visualization Types
export interface ShufflePartition {
    id: number;
    sourceNode: number;
    targetNode: number;
    key: string;
    status: 'pending' | 'shuffling' | 'complete';
    progress: number;
}

// DAG Visualization Types
export interface DAGStage {
    id: number;
    name: string;
    type: 'map' | 'shuffle' | 'reduce';
    dependencies: number[];
    status: 'pending' | 'running' | 'complete' | 'failed';
    tasks: number;
    completedTasks: number;
}

// Lazy Evaluation Types
export interface Transformation {
    id: number;
    name: string;
    type: 'transformation' | 'action';
    status: 'planned' | 'executing' | 'complete';
}

// Data Locality Types
export type LocalityLevel = 'PROCESS_LOCAL' | 'NODE_LOCAL' | 'RACK_LOCAL' | 'ANY';

export interface Task {
    id: number;
    nodeId: number;
    dataLocation: number;
    locality: LocalityLevel;
    duration: number;
    status: 'pending' | 'running' | 'complete';
}

// Straggler Types
export interface ExecutorTask {
    id: number;
    executorId: number;
    startTime: number;
    duration: number;
    isSlow: boolean;
    isSpeculative: boolean;
    status: 'pending' | 'running' | 'complete' | 'killed';
}

// Fault Tolerance Types
export interface RDDLineage {
    id: number;
    name: string;
    dependencies: number[];
    partitions: number;
    cached: boolean;
    status: 'active' | 'lost' | 'recomputing' | 'recovered';
}

export interface SimulationStep {
    id: number;
    description: string;
    timestamp: number;
}
