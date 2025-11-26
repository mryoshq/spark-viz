export enum LayerType {
  CONSUMPTION = 'CONSUMPTION',
  COMPUTE = 'COMPUTE',
  CATALOG = 'CATALOG',
  STORAGE_ENGINE = 'STORAGE_ENGINE',
  FILE_FORMAT = 'FILE_FORMAT',
  STORAGE = 'STORAGE',
}

export interface ArchitectureLayer {
  id: LayerType;
  title: string;
  description: string;
  iconName: string; // Using string names for Lucide icons mapped in component
  details: string[];
  color: string;
}

export interface ClarificationItem {
  id: string;
  question: string;
  answer: string;
}

export interface FactItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}