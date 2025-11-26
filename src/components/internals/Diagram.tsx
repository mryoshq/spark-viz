import React from 'react';
import { StepDefinition, SparkComponentType } from '../../types/internalsTypes';
import { Database, Server, Cpu, Box, Layers, FileCode } from 'lucide-react';

interface DiagramProps {
  step: StepDefinition;
}

// SVG Coordinates
const COORDS = {
  driver: { x: 400, y: 100 },
  user: { x: 100, y: 100 },
  cm: { x: 700, y: 100 },
  worker1: { x: 250, y: 400 },
  worker2: { x: 550, y: 400 },
};

const Diagram: React.FC<DiagramProps> = ({ step }) => {
  const isActive = (comp: SparkComponentType) => step.activeComponents.includes(comp);
  const isEdgeActive = (id: string) => step.highlightEdges.includes(id);

  // Helper to render connection lines
  const renderConnection = (id: string, start: { x: number, y: number }, end: { x: number, y: number }, active: boolean, particleColor: string = '#60a5fa') => {
    // Calculate control point for curve
    const midY = (start.y + end.y) / 2;
    const pathData = `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;

    return (
      <g key={id} className="transition-all duration-500">
        {/* Background line */}
        <path
          d={pathData}
          stroke={active ? "#475569" : "#1e293b"}
          strokeWidth="2"
          fill="none"
          className="transition-colors duration-500"
        />

        {/* Animated Particle */}
        {active && (
          <circle r="4" fill={particleColor}>
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              path={pathData}
              keyPoints={id.includes('driver-exec') ? "0;1" : id.includes('exec') ? "1;0" : "0;1"}
              keyTimes="0;1"
            />
          </circle>
        )}
      </g>
    );
  };

  const renderNode = (
    x: number,
    y: number,
    type: SparkComponentType,
    Icon: React.FC<any>,
    colorClass: string,
    label: string
  ) => {
    const active = isActive(type);

    return (
      <foreignObject x={x - 60} y={y - 50} width="120" height="120" className="overflow-visible">
        <div
          className={`
            group flex flex-col items-center justify-center w-full h-full transition-all duration-500
            ${active ? 'scale-110' : 'scale-100 opacity-50 grayscale'}
          `}
        >
          <div className={`
            relative flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg mb-2 border-2
            ${active ? `${colorClass} shadow-[0_0_30px_rgba(255,255,255,0.1)] border-white/20` : 'bg-slate-800 border-slate-700 text-slate-500'}
            transition-all duration-300
          `}>
            <Icon size={32} className={active ? 'text-white' : 'text-slate-500'} />

            {/* Sub-components (e.g., SparkSession inside Driver) */}
            {type === SparkComponentType.DRIVER && isActive(SparkComponentType.SPARK_SESSION) && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-[10px] text-black font-bold animate-bounce">
                SS
              </div>
            )}

            {/* Tasks inside Executor */}
            {type === SparkComponentType.EXECUTOR && isActive(SparkComponentType.TASK) && (
              <div className="absolute -bottom-2 -right-2 flex gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse delay-75" />
              </div>
            )}
          </div>
          <span className={`text-xs font-semibold tracking-wider ${active ? 'text-white' : 'text-slate-600'}`}>
            {label}
          </span>
        </div>
      </foreignObject>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900/50 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
      <svg viewBox="0 0 800 600" className="w-full h-full max-w-4xl select-none">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgb(147, 51, 234)', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* EDGES */}
        {/* User -> Driver */}
        {renderConnection('user-driver', COORDS.user, COORDS.driver, isEdgeActive('user-driver'), '#cbd5e1')}

        {/* Driver -> CM */}
        {renderConnection('driver-cm', COORDS.driver, COORDS.cm, isEdgeActive('driver-cm'), '#9333ea')}

        {/* CM -> Workers (Allocation) */}
        {renderConnection('cm-worker1', COORDS.cm, { x: COORDS.worker1.x, y: COORDS.worker1.y - 40 }, isEdgeActive('cm-worker1'), '#a855f7')}
        {renderConnection('cm-worker2', COORDS.cm, { x: COORDS.worker2.x, y: COORDS.worker2.y - 40 }, isEdgeActive('cm-worker2'), '#a855f7')}

        {/* Driver -> Executors (Task Dispatch) */}
        {renderConnection('driver-exec1', COORDS.driver, { x: COORDS.worker1.x, y: COORDS.worker1.y - 60 }, isEdgeActive('driver-exec1'), '#f97316')}
        {renderConnection('driver-exec2', COORDS.driver, { x: COORDS.worker2.x, y: COORDS.worker2.y - 60 }, isEdgeActive('driver-exec2'), '#f97316')}

        {/* Executors -> Driver (Results) */}
        {renderConnection('exec1-driver', { x: COORDS.worker1.x, y: COORDS.worker1.y - 60 }, COORDS.driver, isEdgeActive('exec1-driver'), '#22c55e')}
        {renderConnection('exec2-driver', { x: COORDS.worker2.x, y: COORDS.worker2.y - 60 }, COORDS.driver, isEdgeActive('exec2-driver'), '#22c55e')}


        {/* NODES */}
        {renderNode(COORDS.user.x, COORDS.user.y, SparkComponentType.USER_CODE, FileCode, 'bg-slate-600', 'User Code')}
        {renderNode(COORDS.driver.x, COORDS.driver.y, SparkComponentType.DRIVER, Cpu, 'bg-blue-600', 'Driver')}
        {renderNode(COORDS.cm.x, COORDS.cm.y, SparkComponentType.CLUSTER_MANAGER, Server, 'bg-purple-600', 'Cluster Mgr')}

        {/* Worker Containers */}
        <rect x={COORDS.worker1.x - 70} y={COORDS.worker1.y - 60} width="140" height="140" rx="10"
          fill="none" stroke={isActive(SparkComponentType.WORKER) ? "#334155" : "transparent"} strokeDasharray="4 4" />
        <rect x={COORDS.worker2.x - 70} y={COORDS.worker2.y - 60} width="140" height="140" rx="10"
          fill="none" stroke={isActive(SparkComponentType.WORKER) ? "#334155" : "transparent"} strokeDasharray="4 4" />

        {renderNode(COORDS.worker1.x, COORDS.worker1.y, SparkComponentType.EXECUTOR, Layers, 'bg-emerald-600', 'Executor 1')}
        {renderNode(COORDS.worker2.x, COORDS.worker2.y, SparkComponentType.EXECUTOR, Layers, 'bg-emerald-600', 'Executor 2')}

      </svg>

      {/* Overlay Legend for currently active nodes inside Workers if applicable */}
      {isActive(SparkComponentType.CACHE) && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-200 text-xs">
            <Database size={12} />
            <span>Block Manager Active</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Diagram;
