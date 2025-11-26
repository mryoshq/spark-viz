import React from 'react';
import { motion } from 'framer-motion';
import { ArchitectureLayer, LayerType } from '../../types/lakehouseTypes';
import { X, Check } from 'lucide-react';

interface LayerDetailProps {
  layer: ArchitectureLayer | null;
  onClose: () => void;
}

export const LayerDetail: React.FC<LayerDetailProps> = ({ layer, onClose }) => {
  if (!layer) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 animate-pulse">
          <span className="text-2xl">?</span>
        </div>
        <h3 className="text-lg font-medium text-slate-400">Select a layer to view details</h3>
        <p className="text-sm max-w-xs mt-2 opacity-60">
          Click on any block in the architecture diagram to understand its role in the Lakehouse.
        </p>
      </div>
    );
  }

  // Special content for Spark (Compute) as requested in prompt
  const isCompute = layer.id === LayerType.COMPUTE;

  return (
    <div className="h-full flex flex-col relative bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className={`p-6 border-b border-slate-800 relative overflow-hidden`}>
        <div className={`absolute inset-0 opacity-10 ${layer.color.replace('text-', 'bg-')}`}></div>
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{layer.title}</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {layer.id}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto flex-1 space-y-6 scrollbar-thin">

        <div className="prose prose-invert">
          <p className="text-lg leading-relaxed text-slate-300">
            {layer.description}
          </p>
        </div>

        {isCompute && (
          <div className="bg-orange-900/20 border border-orange-500/30 p-4 rounded-lg">
            <h4 className="text-orange-400 font-bold mb-2 text-sm uppercase tracking-wider">The Engine Role</h4>
            <p className="text-sm text-slate-300 mb-2">
              Spark acts as the central processor. It doesn't store data long-term; it pulls data into memory from the
              <span className="text-emerald-400"> File Layer</span>,
              guided by the <span className="text-cyan-400"> Storage Engine</span> and <span className="text-blue-400"> Catalog</span>.
            </p>
            <p className="text-sm text-slate-300">
              This decoupling allows you to scale compute (Spark nodes) independently from storage (S3 capacity).
            </p>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
            Key Technologies & Features
          </h3>
          <ul className="space-y-2">
            {layer.details.map((detail, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 text-slate-400 text-sm bg-slate-800/50 p-3 rounded-lg border border-slate-700/50"
              >
                <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                <span>{detail}</span>
              </motion.li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};
