import React, { useState } from 'react';
import { RotateCcw, StepForward, Server, HardDrive } from 'lucide-react';
import { LocalityLevel } from '../../types/advancedTypes';

interface Node {
    id: number;
    name: string;
    rack: number;
    hasData: boolean;
    assignedTask: boolean;
    locality?: LocalityLevel;
}

export const DataLocalityViz: React.FC = () => {
    const [step, setStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // 3 racks, each with 2 nodes
    const initialNodes: Node[] = [
        // Rack 1
        { id: 1, name: 'Node 1', rack: 1, hasData: true, assignedTask: false },
        { id: 2, name: 'Node 2', rack: 1, hasData: false, assignedTask: false },
        // Rack 2
        { id: 3, name: 'Node 3', rack: 2, hasData: true, assignedTask: false },
        { id: 4, name: 'Node 4', rack: 2, hasData: false, assignedTask: false },
        // Rack 3
        { id: 5, name: 'Node 5', rack: 3, hasData: false, assignedTask: false },
        { id: 6, name: 'Node 6', rack: 3, hasData: false, assignedTask: false },
    ];

    const getNodes = (): Node[] => {
        const nodes = [...initialNodes];

        if (step === 0) return nodes;

        // Step 1: PROCESS_LOCAL - Task scheduled on Node 1 (where data is)
        if (step >= 1) {
            nodes[0] = { ...nodes[0], assignedTask: true, locality: 'PROCESS_LOCAL' };
        }

        // Step 2: NODE_LOCAL - Task scheduled on Node 3 (where data is)
        if (step >= 2) {
            nodes[2] = { ...nodes[2], assignedTask: true, locality: 'PROCESS_LOCAL' };
        }

        // Step 3: RACK_LOCAL - Node 2 (same rack as Node 1, but no data)
        if (step >= 3) {
            nodes[1] = { ...nodes[1], assignedTask: true, locality: 'RACK_LOCAL' };
        }

        // Step 4: ANY - Node 5 (different rack, no data nearby)
        if (step >= 4) {
            nodes[4] = { ...nodes[4], assignedTask: true, locality: 'ANY' };
        }

        return nodes;
    };

    const nodes = getNodes();

    const handleNext = () => {
        if (step < 4 && !isAnimating) {
            setIsAnimating(true);
            setTimeout(() => {
                setStep(s => s + 1);
                setIsAnimating(false);
            }, 700);
        }
    };

    const handleReset = () => {
        setStep(0);
        setIsAnimating(false);
    };

    const getLocalityColor = (locality?: LocalityLevel) => {
        switch (locality) {
            case 'PROCESS_LOCAL': return 'border-green-500 bg-green-500/20';
            case 'NODE_LOCAL': return 'border-blue-500 bg-blue-500/20';
            case 'RACK_LOCAL': return 'border-yellow-500 bg-yellow-500/20';
            case 'ANY': return 'border-red-500 bg-red-500/20';
            default: return 'border-slate-600 bg-slate-800';
        }
    };

    const getLocalityLabel = (locality?: LocalityLevel) => {
        switch (locality) {
            case 'PROCESS_LOCAL': return { text: 'PROCESS_LOCAL', color: 'text-green-400', icon: '', speed: 'Fastest' };
            case 'NODE_LOCAL': return { text: 'NODE_LOCAL', color: 'text-blue-400', icon: '', speed: 'Fast' };
            case 'RACK_LOCAL': return { text: 'RACK_LOCAL', color: 'text-yellow-400', icon: '', speed: 'Slower' };
            case 'ANY': return { text: 'ANY', color: 'text-red-400', icon: '', speed: 'Slowest' };
            default: return { text: '', color: '', icon: '', speed: '' };
        }
    };

    const getNodesByRack = (rackId: number) => nodes.filter(n => n.rack === rackId);

    return (
        <div className="h-full flex flex-col p-8">
            {/* Controls */}
            <div className="mb-8 flex items-center gap-4 bg-slate-900 p-4 rounded-lg border border-slate-800">
                <button
                    onClick={handleNext}
                    disabled={step >= 4 || isAnimating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${step >= 4 || isAnimating
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-500'
                        }`}
                >
                    <StepForward size={18} /> {isAnimating ? 'Animating...' : 'Schedule Task'}
                </button>

                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700"
                >
                    <RotateCcw size={18} /> Reset
                </button>

                <div className="ml-auto text-sm text-slate-400">
                    Tasks Scheduled: <span className="text-white font-mono">{step}</span> / 4
                </div>
            </div>

            {/* Explanation */}
            <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h3 className="text-green-400 font-bold mb-2 text-sm uppercase tracking-wider">Data Locality Optimization</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                    {step === 0 && "Spark prefers to schedule tasks where data already exists. Click 'Schedule Task' to see locality levels."}
                    {step === 1 && "PROCESS_LOCAL (best) - Task runs on the same executor that has the data in memory. No network transfer!"}
                    {step === 2 && "Another PROCESS_LOCAL task - Data is local to the executor. Maximum efficiency."}
                    {step === 3 && "RACK_LOCAL - Task runs on a different node in the same rack. Requires intra-rack network transfer."}
                    {step === 4 && "ANY (worst) - Task runs on a node in a different rack. Requires cross-rack network transfer. Highest latency."}
                </p>
            </div>

            {/* Cluster Visualization */}
            <div className="flex-1 flex flex-col gap-8 overflow-auto">
                {[1, 2, 3].map(rackId => (
                    <div key={rackId} className="bg-slate-900 rounded-xl p-6 border-2 border-slate-700">
                        <div className="flex items-center gap-2 mb-4">
                            <Server size={20} className="text-purple-400" />
                            <h3 className="text-lg font-bold text-white">Rack {rackId}</h3>
                            <div className="ml-auto text-xs text-slate-500 font-mono">10.0.{rackId}.0/24</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {getNodesByRack(rackId).map(node => (
                                <div
                                    key={node.id}
                                    className={`p-4 rounded-lg border-2 transition-all ${getLocalityColor(node.locality)
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${node.assignedTask ? 'bg-blue-400 animate-pulse' : 'bg-slate-600'
                                                }`}></div>
                                            <span className="font-bold text-white">{node.name}</span>
                                        </div>
                                        {node.hasData && (
                                            <div className="flex items-center gap-1 text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded border border-cyan-500/30">
                                                <HardDrive size={12} />
                                                <span>Data</span>
                                            </div>
                                        )}
                                    </div>

                                    {node.assignedTask && node.locality && (
                                        <div className="mt-3 pt-3 border-t border-slate-700">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{getLocalityLabel(node.locality).icon}</span>
                                                    <div>
                                                        <div className={`text-xs font-bold ${getLocalityLabel(node.locality).color}`}>
                                                            {getLocalityLabel(node.locality).text}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400">
                                                            {getLocalityLabel(node.locality).speed}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                                    Task Running
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!node.assignedTask && (
                                        <div className="text-xs text-slate-500 italic">Idle</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-6 grid grid-cols-4 gap-4 text-xs">
                <div className="flex items-center gap-2 p-2 rounded bg-green-500/10 border border-green-500/30">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <div>
                        <div className="font-bold text-green-400">PROCESS_LOCAL</div>
                        <div className="text-slate-400">Data in executor memory</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-blue-500/10 border border-blue-500/30">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <div>
                        <div className="font-bold text-blue-400">NODE_LOCAL</div>
                        <div className="text-slate-400">Data on same node</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-yellow-500/10 border border-yellow-500/30">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <div>
                        <div className="font-bold text-yellow-400">RACK_LOCAL</div>
                        <div className="text-slate-400">Data in same rack</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-red-500/10 border border-red-500/30">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <div>
                        <div className="font-bold text-red-400">ANY</div>
                        <div className="text-slate-400">Data in different rack</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
