import { ArchitectureLayer, LayerType, ClarificationItem, FactItem } from '../types/lakehouseTypes';

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: LayerType.CONSUMPTION,
    title: 'Consumption Layer',
    description: 'Tools consuming data for Analytics, BI, and ML.',
    iconName: 'MonitorPlay',
    details: [
      'BI Tools (Tableau, PowerBI)',
      'Data Science Notebooks (Jupyter)',
      'ML Models',
      'SQL Clients'
    ],
    color: 'text-purple-400 border-purple-500/50 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]',
  },
  {
    id: LayerType.COMPUTE,
    title: 'Compute Engine (Apache Spark)',
    description: 'The distributed processing brain that executes queries.',
    iconName: 'Cpu',
    details: [
      'Distributed Processing',
      'In-Memory Caching',
      'Query Planning (Catalyst Optimizer)',
      'Code Generation (Tungsten)'
    ],
    color: 'text-orange-400 border-orange-500/50 bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]',
  },
  {
    id: LayerType.CATALOG,
    title: 'Data Catalog',
    description: 'Manages metadata, schemas, and governance.',
    iconName: 'Book',
    details: [
      'Schema Management',
      'Access Control (ACLs)',
      'Data Discovery',
      'Unity Catalog / Hive Metastore'
    ],
    color: 'text-blue-400 border-blue-500/50 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
  },
  {
    id: LayerType.STORAGE_ENGINE,
    title: 'Table Format / Storage Engine',
    description: 'Adds transaction capabilities (ACID) to files.',
    iconName: 'Database',
    details: [
      'Delta Lake, Apache Iceberg, Apache Hudi',
      'ACID Transactions',
      'Time Travel / Versioning',
      'Metadata Handling'
    ],
    color: 'text-cyan-400 border-cyan-500/50 bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]',
  },
  {
    id: LayerType.FILE_FORMAT,
    title: 'File Format Layer',
    description: 'How data is physically encoded (binary/text).',
    iconName: 'FileCode',
    details: [
      'Parquet (Columnar)',
      'Avro (Row-based)',
      'ORC',
      'JSON / CSV'
    ],
    color: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
  },
  {
    id: LayerType.STORAGE,
    title: 'Physical Storage Layer',
    description: 'Cheap, scalable object storage infrastructure.',
    iconName: 'HardDrive',
    details: [
      'Amazon S3',
      'Azure Data Lake Storage (ADLS)',
      'Google Cloud Storage (GCS)',
      'HDFS (Legacy)'
    ],
    color: 'text-slate-400 border-slate-500/50 bg-slate-500/20 shadow-[0_0_15px_rgba(100,116,139,0.1)]',
  },
];

export const CLARIFICATIONS: ClarificationItem[] = [
  {
    id: 'lake-vs-warehouse',
    question: 'Data Lake vs. Data Warehouse',
    answer: 'A Data Warehouse is a structured, optimized system for processed data (SQL). A Data Lake is a repository for raw, unstructured data (files). A Lakehouse combines the low cost of a lake with the structure/ACID features of a warehouse.',
  },
  {
    id: 'storage-separation',
    question: 'Decoupled Compute & Storage',
    answer: 'In modern architectures, storage (S3/GCS) scales independently from compute (Spark clusters). You pay for storage even when clusters are off, and you can spin up 1000 Spark nodes for 10 minutes without moving data.',
  },
  {
    id: 'storage-clusters',
    question: 'What are Storage Clusters?',
    answer: 'Traditionally (Hadoop), storage and compute were on the same nodes. Now, "Storage Clusters" usually refers to distributed object storage services (like S3) that manage redundancy and availability automatically, abstracting the physical disks away from the user.',
  },
  {
    id: 'why-spark',
    question: 'Why Spark as the Engine?',
    answer: 'Spark is fast (in-memory), unified (supports SQL, Streaming, ML, Graph), and fault-tolerant. It acts as the "operating system" of the data lake, providing a unified API to read from various formats and write to various destinations.',
  },
];

export const FACTS: FactItem[] = [
  {
    id: 'lake-wh',
    title: 'Lake vs. Warehouse',
    description: 'Data Lakes hold raw files (schema-on-read). Warehouses hold structured tables (schema-on-write). Lakehouses combine low-cost storage with ACID reliability.',
    iconName: 'Database'
  },
  {
    id: 'partitioning',
    title: 'Partitioning Strategy',
    description: 'Saving data in folders like "/year=2024/" lets Spark skip scanning massive amounts of irrelevant files. This is called "Partition Pruning".',
    iconName: 'FolderTree'
  },
  {
    id: 'compute-storage',
    title: 'Decoupled Architecture',
    description: 'Compute (Spark) and Storage (S3) scale independently. You can shut down all servers at night while keeping PBs of data for pennies.',
    iconName: 'Server'
  },
  {
    id: 'lazy-eval',
    title: 'Fun Fact: Laziness',
    description: 'Spark is "lazy". It records your transformations (map, filter) as a lineage graph (DAG) and only executes them when you ask for a result.',
    iconName: 'Zap'
  }
];