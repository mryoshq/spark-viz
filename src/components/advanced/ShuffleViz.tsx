import React, { useState } from 'react';
import { RotateCcw, StepForward } from 'lucide-react';

export const ShuffleViz: React.FC = () => {
    const [step, setStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Shuffle simulation: 4 source nodes, each with data that needs to be partitioned by key to 4 target nodes
    const sourceNodes = [1, 2, 3, 4];
    const targetNodes = [1, 2, 3, 4];

    const getPartitionStatus = (sourceId: number, targetId: number): 'pending' | 'shuffling' | 'complete' => {
        const partitionIndex = (sourceId - 1) * 4 + (targetId - 1);
        if (step === 0) return 'pending';
        if (partitionIndex < step) return 'complete';
        if (partitionIndex === step) return 'shuffling';
        return 'pending';
    };

    const handleNext = () => {
        if (step < 16 && !isAnimating) {
            setIsAnimating(true);
            setTimeout(() => {
                setStep(s => s + 1);
                setIsAnimating(false);
            }, 400);
        }
    };

    const handleReset = () => {
        setStep(0);
        setIsAnimating(false);
    };

    const totalPartitions = 16;
    const completedPartitions = Math.min(step, 16);

    return (
        <div className="h-full flex flex-col p-8">
            {/* Controls */}
            <div className="mb-8 flex items-center gap-4 bg-slate-900 p-4 rounded-lg border border-slate-800">
                <button
                    onClick={handleNext}
                    disabled={step >= 16 || isAnimating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${step >= 16 || isAnimating
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-orange-600 text-white hover:bg-orange-500'
                        }`}
                >
                    <StepForward size={18} /> {isAnimating ? 'Animating...' : 'Next Step'}
                </button>

                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700"
                >
                    <RotateCcw size={18} /> Reset
                </button>

                <div className="ml-auto text-sm text-slate-400">
                    Step: <span className="text-white font-mono">{step}</span> / 16
                    <span className="mx-2">|</span>
                    Shuffled: <span className="text-green-400 font-mono">{completedPartitions}</span> / {totalPartitions}
                </div>
            </div>

            {/* Explanation */}
            <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-blue-400 font-bold mb-2 text-sm uppercase tracking-wider">What's Happening?</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                    {step === 0 && "Each source node has data with different keys (A, B, C, D). Click 'Next Step' to start the shuffle."}
                    {step > 0 && step < 16 && "Data is being redistributed based on hash partitioning. Each key goes to a specific target node."}
                    {step === 16 && "Shuffle complete! All data has been repartitioned by key across target nodes. This is expensive due to network transfer."}
                </p>
            </div>

            {/* Visualization */}
            <div className="flex-1 flex items-center justify-center gap-12">
                {/* Source Nodes */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Map Side (Source)</h3>
                    {sourceNodes.map(id => (
                        <div key={id} className="relative">
                            <div className="w-32 h-32 bg-slate-800 border-2 border-slate-600 rounded-xl flex flex-col items-center justify-center">
                                <div className="text-slate-400 text-xs font-mono mb-2">Source {id}</div>
                                <div className="flex gap-1">
                                    {['A', 'B', 'C', 'D'].map((key, i) => (
                                        <div key={i} className={`w-6 h-6 rounded text-[10px] flex items-center justify-center font-bold ${getPartitionStatus(id, i + 1) === 'complete' ? 'bg-slate-700 text-slate-500' :
                                                getPartitionStatus(id, i + 1) === 'shuffling' ? 'bg-orange-500 text-white animate-pulse' :
                                                    'bg-blue-500 text-white'
                                            }`}>
                                            {key}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Shuffle Visualization */}
                <div className="flex flex-col items-center justify-center">
                    <div className="text-orange-400 font-bold mb-4 text-sm">SHUFFLE</div>
                    <div className="flex items-center gap-2">
                        <div className="w-32 h-0.5 bg-gradient-to-r from-blue-500 to-orange-500"></div>
                        <div className={`w-3 h-3 rounded-full ${step > 0 && step < 16 ? 'bg-orange-500 animate-ping' : 'bg-slate-600'}`}></div>
                        <div className="w-32 h-0.5 bg-gradient-to-r from-orange-500 to-green-500"></div>
                    </div>
                    <div className="text-xs text-slate-500 mt-4 font-mono">
                        Network Transfer: {completedPartitions * 0.25} MB
                    </div>
                </div>

                {/* Target Nodes */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Reduce Side (Target)</h3>
                    {targetNodes.map(id => (
                        <div key={id} className="relative">
                            <div className="w-32 h-32 bg-slate-800 border-2 border-slate-600 rounded-xl flex flex-col items-center justify-center">
                                <div className="text-slate-400 text-xs font-mono mb-2">Target {id}</div>
                                <div className="flex flex-wrap gap-1 justify-center max-w-[100px]">
                                    {sourceNodes.map(sourceId => {
                                        const status = getPartitionStatus(sourceId, id);
                                        const key = ['A', 'B', 'C', 'D'][id - 1];
                                        return (
                                            <div key={sourceId} className={`w-6 h-6 rounded text-[10px] flex items-center justify-center font-bold ${status === 'complete' ? 'bg-green-500 text-white' :
                                                    status === 'shuffling' ? 'bg-orange-500 text-white animate-pulse' :
                                                        'bg-slate-700 text-slate-600'
                                                }`}>
                                                {status !== 'pending' ? key : ''}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-slate-400">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-slate-400">Shuffling</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-slate-400">Complete</span>
                </div>
            </div>
        </div>
    );
};
