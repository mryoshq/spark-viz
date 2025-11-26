import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArchitectureLayer, LayerType } from '../../types/lakehouseTypes';
import { ARCHITECTURE_LAYERS } from '../../constants/lakehouseConstants';
import * as Icons from 'lucide-react';
import { DataFlowAnimation } from './DataFlowAnimation';

interface ArchitectureDiagramProps {
  selectedLayer: ArchitectureLayer | null;
  onSelectLayer: (layer: ArchitectureLayer) => void;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  selectedLayer,
  onSelectLayer
}) => {
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateQuery = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSimulating(true);
    // Stop simulation after 5 seconds
    setTimeout(() => setIsSimulating(false), 5000);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto flex flex-col justify-center items-center p-4 md:p-8 min-h-[600px]">

      {/* Simulation Background Animation */}
      <DataFlowAnimation isAnimating={isSimulating} />

      {/* Simulation Controls */}
      <div className="mb-8 z-30 relative">
        <button
          onClick={handleSimulateQuery}
          disabled={isSimulating}
          className={`
            px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-xl transition-all border border-white/10
            ${isSimulating
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white hover:scale-105 hover:shadow-orange-500/20'}
          `}
        >
          {isSimulating ? (
            <>
              <Icons.Loader2 className="animate-spin" size={16} /> Processing...
            </>
          ) : (
            <>
              <Icons.Play size={16} /> Simulate Query Flow
            </>
          )}
        </button>
      </div>

      <div className="w-full space-y-4 relative z-10">
        {ARCHITECTURE_LAYERS.map((layer) => {
          // Dynamic Icon Loading
          const IconComponent = (Icons as any)[layer.iconName] || Icons.Box;
          const isSelected = selectedLayer?.id === layer.id;
          const isCompute = layer.id === LayerType.COMPUTE;

          return (
            <motion.div
              key={layer.id}
              layoutId={layer.id}
              onClick={() => onSelectLayer(layer)}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: isSelected ? 1.02 : 1,
                borderColor: isSelected ? 'rgba(251, 146, 60, 0.8)' : 'rgba(51, 65, 85, 0.5)'
              }}
              whileHover={{ scale: 1.02 }}
              className={`
                relative cursor-pointer rounded-xl border-2 p-4 md:p-6 transition-all duration-300
                ${layer.color}
                ${isSelected ? 'bg-opacity-30 shadow-xl' : 'bg-opacity-20 hover:bg-opacity-30'}
                ${isCompute && isSimulating ? 'animate-pulse shadow-[0_0_30px_rgba(249,115,22,0.3)] border-orange-500' : ''}
              `}
            >
              {/* Connection Lines (Purely visual for stack effect) */}
              {layer.id !== LayerType.STORAGE && (
                <div className="absolute -bottom-5 left-1/2 w-0.5 h-5 bg-slate-700 -translate-x-1/2 -z-10"></div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${isSelected ? 'bg-white/10' : 'bg-black/20'}`}>
                    <IconComponent
                      size={24}
                      className={`${isSimulating && isCompute ? 'animate-spin' : ''}`}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg md:text-xl tracking-wide">{layer.title}</h3>
                    <p className="text-xs md:text-sm opacity-70 hidden md:block">{layer.description}</p>
                  </div>
                </div>

                {/* Status indicator dot */}
                <div className={`
                  w-3 h-3 rounded-full transition-colors duration-500
                  ${isSelected ? 'bg-white shadow-[0_0_10px_white]' : 'bg-white/20'}
                  ${isSimulating && isCompute ? 'bg-orange-500 shadow-[0_0_10px_orange]' : ''}
                `}></div>
              </div>

              {/* Simulation Text showing what's happening at this layer */}
              {isSimulating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-xs font-mono text-cyan-300 bg-black/60 px-2 py-1 rounded hidden md:block"
                >
                  {getSimulationStatus(layer.id)}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

function getSimulationStatus(id: LayerType): string {
  switch (id) {
    case LayerType.CONSUMPTION: return "Requesting Data...";
    case LayerType.COMPUTE: return "Executing Plan...";
    case LayerType.CATALOG: return "Resolving Schema...";
    case LayerType.STORAGE_ENGINE: return "Filtering Snapshots...";
    case LayerType.FILE_FORMAT: return "Decoding Parquet...";
    case LayerType.STORAGE: return "Reading Bytes...";
    default: return "";
  }
}
