import React, { useState } from 'react';
import { RotateCcw, StepForward, Wifi, Clock } from 'lucide-react';

interface Operation {
    id: number;
    name: string;
    type: 'narrow' | 'wide';
    networkCost: number; // MB transferred
    executionTime: number; // seconds
    strategy: string;
    executed: boolean;
}

export const NetworkOverheadViz: React.FC = () => {
    const [step, setStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const operations: Operation[] = [
        {
            id: 1,
            name: 'map()',
            type: 'narrow',
            networkCost: 5,
            executionTime: 0.2,
            strategy: 'Data locality - process where data lives',
            executed: false
        },
        {
            id: 2,
            name: 'filter()',
            type: 'narrow',
            networkCost: 3,
            executionTime: 0.15,
            strategy: 'Pipelined with map - minimal movement',
            executed: false
        },
        {
            id: 3,
            name: 'groupByKey()',
            type: 'wide',
            networkCost: 180,
            executionTime: 2.5,
            strategy: 'Full shuffle - ALL data redistributed by key',
            executed: false
        },
        {
            id: 4,
            name: 'map()',
            type: 'narrow',
            networkCost: 4,
            executionTime: 0.18,
            strategy: 'Post-shuffle - data already partitioned',
            executed: false
        },
        {
            id: 5,
            name: 'reduceByKey()',
            type: 'wide',
            networkCost: 120,
            executionTime: 1.8,
            strategy: 'Shuffle + combine - partial aggregation reduces cost',
            executed: false
        },
    ];

    const getOperations = (): Operation[] => {
        return operations.map((op, index) => ({
            ...op,
            executed: index < step,
        }));
    };

    const currentOps = getOperations();
    const totalNetworkCost = currentOps.filter(op => op.executed).reduce((sum, op) => sum + op.networkCost, 0);
    const totalTime = currentOps.filter(op => op.executed).reduce((sum, op) => sum + op.executionTime, 0);

    const handleNext = () => {
        if (step < operations.length && !isAnimating) {
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

    const currentOp = step > 0 && step <= operations.length ? operations[step - 1] : null;

    return (
        <div className="h-full flex flex-col p-6">
            {/* Controls */}
            <div className="mb-4 flex items-center gap-4 bg-slate-900 p-3 rounded-lg border border-slate-800">
                <button
                    onClick={handleNext}
                    disabled={step >= operations.length || isAnimating}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${step >= operations.length || isAnimating
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-500'
                        }`}
                >
                    <StepForward size={16} /> {isAnimating ? 'Executing...' : 'Execute Next'}
                </button>

                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700"
                >
                    <RotateCcw size={16} /> Reset
                </button>

                <div className="ml-auto flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Wifi size={12} />
                        Network: <span className="text-orange-400 font-mono font-bold">{totalNetworkCost} MB</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={12} />
                        Time: <span className="text-blue-400 font-mono font-bold">{totalTime.toFixed(2)}s</span>
                    </div>
                </div>
            </div>

            {/* Explanation */}
            <div className="mb-4 bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <h3 className="text-purple-400 font-bold mb-1 text-xs uppercase tracking-wider">Network Cost & Execution Time</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                    {step === 0 && "Both narrow and wide ops use network, but the magnitude differs by 20-50x! Narrow ops leverage data locality."}
                    {currentOp && currentOp.type === 'narrow' && `${currentOp.name}: ${currentOp.networkCost}MB, ${currentOp.executionTime}s - ${currentOp.strategy}`}
                    {currentOp && currentOp.type === 'wide' && `${currentOp.name}: ${currentOp.networkCost}MB, ${currentOp.executionTime}s - ${currentOp.strategy}`}
                    {step === operations.length && `Complete! ${totalNetworkCost}MB, ${totalTime.toFixed(1)}s. Wide ops: ${(180 + 120)}MB (95%), Narrow ops: ${5 + 3 + 4}MB (5%).`}
                </p>
            </div>

            <div className="flex-1 flex gap-4">
                {/* Left: Pipeline */}
                <div className="flex-1 bg-slate-900 rounded-lg border border-slate-800 p-4">
                    <h3 className="text-sm font-bold text-white mb-3">Operation Pipeline</h3>
                    <div className="space-y-2">
                        {currentOps.map((op) => (
                            <div key={op.id} className="space-y-1">
                                <div className={`p-2.5 rounded-lg border-2 transition-all ${op.executed
                                    ? op.type === 'wide'
                                        ? 'bg-orange-500/20 border-orange-500'
                                        : 'bg-blue-500/20 border-blue-500'
                                    : 'bg-slate-800 border-slate-700'
                                    }`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${op.executed ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                                            <code className={`text-xs font-mono font-bold ${op.executed ? 'text-white' : 'text-slate-500'}`}>
                                                {op.name}
                                            </code>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {op.executed && (
                                                <>
                                                    <div className={`text-[10px] px-2 py-0.5 rounded font-bold ${op.type === 'wide' ? 'bg-orange-600 text-white' : 'bg-blue-600 text-white'
                                                        }`}>
                                                        {op.networkCost}MB
                                                    </div>
                                                    <div className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">
                                                        {op.executionTime}s
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {op.executed && (
                                        <div className="text-[9px] text-slate-400 italic mt-1">
                                            {op.strategy}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Comparison & Stats */}
                <div className="w-96 space-y-4">
                    {/* Cost Comparison */}
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
                        <h3 className="text-sm font-bold text-white mb-3">Cost Comparison</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="text-blue-400 font-bold">Narrow Operations</span>
                                    <span className="text-blue-400 font-mono">{currentOps.filter(o => o.executed && o.type === 'narrow').reduce((s, o) => s + o.networkCost, 0)} MB</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-500"
                                        style={{ width: `${Math.min((currentOps.filter(o => o.executed && o.type === 'narrow').reduce((s, o) => s + o.networkCost, 0) / 180) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="text-[9px] text-slate-500 mt-0.5">Minimal - data locality optimized</div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="text-orange-400 font-bold">Wide Operations</span>
                                    <span className="text-orange-400 font-mono">{currentOps.filter(o => o.executed && o.type === 'wide').reduce((s, o) => s + o.networkCost, 0)} MB</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                                        style={{ width: `${(currentOps.filter(o => o.executed && o.type === 'wide').reduce((s, o) => s + o.networkCost, 0) / 300) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="text-[9px] text-slate-500 mt-0.5">High - full cluster shuffle</div>
                            </div>
                        </div>
                    </div>

                    {/* Time Breakdown */}
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
                        <h3 className="text-sm font-bold text-white mb-3">Execution Time</h3>
                        <div className="space-y-2">
                            {currentOps.map(op => (
                                <div key={op.id} className="flex items-center gap-2">
                                    <div className="w-20 text-[10px] text-slate-400 font-mono truncate">{op.name}</div>
                                    <div className="flex-1 bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${op.executed
                                                ? op.type === 'wide'
                                                    ? 'bg-gradient-to-r from-orange-500 to-red-500'
                                                    : 'bg-blue-500'
                                                : 'bg-slate-700'
                                                }`}
                                            style={{ width: op.executed ? `${(op.executionTime / 2.5) * 100}%` : '0%' }}
                                        ></div>
                                    </div>
                                    <div className={`w-10 text-[10px] font-mono text-right ${op.executed ? op.type === 'wide' ? 'text-orange-400 font-bold' : 'text-blue-400' : 'text-slate-600'
                                        }`}>
                                        {op.executed ? `${op.executionTime}s` : '-'}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between items-center">
                            <span className="text-xs text-slate-400">Total Time:</span>
                            <span className="text-sm font-bold font-mono text-blue-400">
                                {totalTime.toFixed(2)}s
                            </span>
                        </div>
                    </div>

                    {/* Optimization Strategies */}
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5">Optimization Strategies</h4>
                        <div className="space-y-1 text-[10px] text-slate-300 leading-relaxed">
                            <div>• <strong className="text-white">Data Locality:</strong> Process data where it lives (reduces narrow cost)</div>
                            <div>• <strong className="text-white">Combiner Functions:</strong> Use reduceByKey vs groupByKey (40% less shuffle)</div>
                            <div>• <strong className="text-white">Partitioning:</strong> Pre-partition data to align with join keys</div>
                            <div>• <strong className="text-white">Broadcast Joins:</strong> For small tables (eliminates shuffle)</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center justify-center gap-6 text-[10px]">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-slate-400">Narrow: 3-5 MB (locality optimized)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-slate-400">Wide: 120-180 MB (full shuffle)</span>
                </div>
            </div>
        </div>
    );
};
