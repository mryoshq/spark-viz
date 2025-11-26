import React from 'react';
import { WorkerNode, Partition, PartitionState } from '../../types/coreInternalsTypes';
import { PartitionBlock } from './PartitionBlock';
import { HardDrive, Cpu, Box } from 'lucide-react';

interface WorkerNodeVizProps {
  worker: WorkerNode;
  partitions: Partition[];
}

export const WorkerNodeViz: React.FC<WorkerNodeVizProps> = ({ worker, partitions }) => {
  const activePartitions = partitions.filter(p => p.workerId === worker.id && p.state === PartitionState.PROCESSING);
  const ramPartitions = partitions.filter(p => worker.partitionsInRam.includes(p.id));
  const diskPartitions = partitions.filter(p => worker.partitionsInDisk.includes(p.id));

  const ramPercentage = Math.min((worker.ramUsedMB / worker.ramTotalMB) * 100, 100);
  const isRamFull = ramPercentage >= 100;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col gap-4 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-slate-800 text-white p-1.5 rounded">
            <Cpu size={16} />
          </div>
          <span className="font-semibold text-slate-800">{worker.name}</span>
        </div>
        <span className="text-xs font-mono text-slate-500">
          {worker.activeTasks}/{worker.cores} Cores Active
        </span>
      </div>

      {/* Processing Slots */}
      <div className="flex gap-2 bg-slate-50 p-3 rounded-lg min-h-[64px] items-center justify-center border border-dashed border-slate-200">
        {activePartitions.length === 0 && <span className="text-xs text-slate-400">Idle</span>}
        {activePartitions.map(p => (
          <PartitionBlock key={p.id} partition={p} />
        ))}
      </div>

      {/* Storage Visualization */}
      <div className="space-y-3">
        {/* RAM Layer */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1">
              <Box size={12} className="text-emerald-600" />
              <span>Memory (Executor Storage)</span>
            </div>
            <span className={isRamFull ? "text-red-500 font-bold" : ""}>
              {worker.ramUsedMB}/{worker.ramTotalMB} MB
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${isRamFull ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${ramPercentage}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-1 pt-1 min-h-[20px]">
            {ramPartitions.map(p => <PartitionBlock key={p.id} partition={p} mini />)}
          </div>
        </div>

        {/* Disk Layer */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1">
              <HardDrive size={12} className="text-amber-600" />
              <span>Disk Spill</span>
            </div>
            <span>{worker.diskUsedMB} MB Used</span>
          </div>
          <div className="flex flex-wrap gap-1 pt-1 min-h-[20px] bg-amber-50/50 p-1 rounded border border-amber-100">
            {diskPartitions.length === 0 && <span className="text-[10px] text-slate-400 italic">No spill</span>}
            {diskPartitions.map(p => <PartitionBlock key={p.id} partition={p} mini />)}
          </div>
        </div>
      </div>
    </div>
  );
};