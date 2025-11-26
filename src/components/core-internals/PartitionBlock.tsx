import React from 'react';
import { Partition, PartitionState } from '../../types/coreInternalsTypes';
import { COLORS } from '../../constants/coreInternalsConstants';

interface PartitionBlockProps {
  partition: Partition;
  mini?: boolean;
  isSourceView?: boolean;
}

export const PartitionBlock: React.FC<PartitionBlockProps> = ({
  partition,
  mini = false,
  isSourceView = false
}) => {
  let colorClass = COLORS.partitionPending;
  let animateClass = '';
  let opacityClass = 'opacity-100';

  // Logic for Source View (Distributed Storage)
  if (isSourceView) {
    if (partition.state === PartitionState.PENDING) {
      colorClass = COLORS.partitionPending;
    } else {
      // Data remains in storage but is marked as read/processed
      colorClass = 'bg-slate-200 text-slate-300 border-slate-200';
      opacityClass = 'opacity-40';
    }
  } else {
    // Logic for Worker/Active View
    switch (partition.state) {
      case PartitionState.PROCESSING:
        colorClass = COLORS.partitionProcessing;
        animateClass = 'animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]';
        break;
      case PartitionState.CACHED_RAM:
        colorClass = COLORS.partitionRam;
        break;
      case PartitionState.CACHED_DISK:
        colorClass = COLORS.partitionDisk;
        break;
      case PartitionState.COMPLETED:
        colorClass = COLORS.partitionCompleted;
        break;
      case PartitionState.IN_FLIGHT:
        colorClass = 'bg-blue-300';
        animateClass = 'scale-90 opacity-80';
        break;
      case PartitionState.PENDING:
        // Should generally not be rendered in worker unless queued, but fallback
        colorClass = COLORS.partitionPending;
        break;
    }
  }

  const sizeClass = mini ? 'w-3 h-3 rounded-sm' : 'w-8 h-8 rounded-md';

  return (
    <div
      className={`${sizeClass} ${colorClass} ${animateClass} ${opacityClass} flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300 border border-white/10`}
      title={`Part #${partition.id} (${partition.sizeMB}MB) - ${partition.state} ${isSourceView ? '(Source Copy)' : ''}`}
    >
      {!mini && !isSourceView && (
        partition.state === PartitionState.PROCESSING
          ? `${Math.round(partition.progress)}%`
          : partition.id
      )}
    </div>
  );
};