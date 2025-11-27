import { Concept, ConceptType } from '../types/advancedTypes';

export const CONCEPTS: Concept[] = [
    {
        id: ConceptType.SHUFFLE,
        title: 'Shuffle Operations',
        description: 'Visualize data redistribution during joins and groupBy operations',
        icon: 'Shuffle',
        difficulty: 'intermediate',
    },
    {
        id: ConceptType.DAG,
        title: 'DAG Execution',
        description: 'See how Spark builds execution stages with dependencies',
        icon: 'GitBranch',
        difficulty: 'intermediate',
    },
    {
        id: ConceptType.LAZY_EVAL,
        title: 'Lazy Evaluation',
        description: 'Understand why transformations build a plan before execution',
        icon: 'Timer',
        difficulty: 'beginner',
    },
    {
        id: ConceptType.DATA_LOCALITY,
        title: 'Data Locality',
        description: 'Task scheduling based on data location for performance',
        icon: 'MapPin',
        difficulty: 'intermediate',
    },
    {
        id: ConceptType.FAULT_TOLERANCE,
        title: 'Fault Tolerance',
        description: 'Task re-execution and RDD lineage tracking',
        icon: 'Shield',
        difficulty: 'advanced',
    },
    {
        id: ConceptType.CATALYST,
        title: 'Catalyst Optimizer',
        description: 'Query optimization from logical to physical plan',
        icon: 'Code',
        difficulty: 'advanced',
    },
    {
        id: ConceptType.NETWORK,
        title: 'Network Overhead',
        description: 'Data transfer costs and optimization strategies',
        icon: 'Network',
        difficulty: 'intermediate',
    },
];

export const COLORS = {
    shuffle: {
        pending: 'bg-slate-600',
        active: 'bg-orange-500',
        complete: 'bg-green-500',
    },
    dag: {
        pending: 'bg-slate-700',
        running: 'bg-blue-500',
        complete: 'bg-emerald-500',
        failed: 'bg-red-500',
    },
    locality: {
        PROCESS_LOCAL: 'bg-green-500',
        NODE_LOCAL: 'bg-blue-500',
        RACK_LOCAL: 'bg-yellow-500',
        ANY: 'bg-red-500',
    },
};
