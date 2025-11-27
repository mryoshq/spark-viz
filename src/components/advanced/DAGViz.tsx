import React, { useState } from 'react';
import { RotateCcw, StepForward } from 'lucide-react';
import { DAGStage } from '../../types/advancedTypes';

interface Transformation {
    name: string;
    type: 'narrow' | 'wide';
    completed: boolean;
}

export const DAGViz: React.FC = () => {
    const [step, setStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Stage 1: Narrow transformations (can pipeline)
    const stage1Transformations: Transformation[] = [
        { name: 'textFile("data.txt")', type: 'narrow', completed: false },
        { name: 'map(parseLine)', type: 'narrow', completed: false },
        { name: 'filter(isValid)', type: 'narrow', completed: false },
    ];

    // Stage 2: After shuffle, more narrow transformations
    const stage2Transformations: Transformation[] = [
        { name: 'reduceByKey(sum)', type: 'wide', completed: false },
        { name: 'mapValues(format)', type: 'narrow', completed: false },
    ];

    const getTransformationStatus = (stageId: number, transIndex: number) => {
        if (stageId === 1) {
            // Stage 1: steps 0-3 (all transformations execute together, pipelined)
            if (step === 0) return { completed: false, active: false };
            if (step >= 1) return { completed: true, active: step === 1 };
        }
        if (stageId === 2) {
            // Shuffle happens at step 2
            // Stage 2: steps 3-4
            if (step < 3) return { completed: false, active: false };
            if (transIndex === 0) {
                // reduceByKey
                return { completed: step > 3, active: step === 3 };
            }
            if (transIndex === 1) {
                // mapValues
                return { completed: step > 4, active: step === 4 };
            }
        }
        return { completed: false, active: false };
    };

    const stage1Status = step >= 1 ? 'complete' : step > 0 ? 'running' : 'pending';
    const shuffleActive = step === 2;
    const shuffleComplete = step > 2;
    const stage2Status = step < 3 ? 'pending' : step >= 5 ? 'complete' : 'running';

    const handleNext = () => {
        if (step < 5 && !isAnimating) {
            setIsAnimating(true);
            setTimeout(() => {
                setStep(s => s + 1);
                setIsAnimating(false);
            }, 800);
        }
    };

    const handleReset = () => {
        setStep(0);
        setIsAnimating(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-slate-500';
            case 'running': return 'text-blue-400';
            case 'complete': return 'text-emerald-400';
            default: return 'text-slate-500';
        }
    };

    return (
        <div className="h-full flex flex-col p-8">
            {/* Controls */}
            <div className="mb-8 flex items-center gap-4 bg-slate-900 p-4 rounded-lg border border-slate-800">
                <button
                    onClick={handleNext}
                    disabled={step >= 5 || isAnimating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${step >= 5 || isAnimating
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-500'
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
                    Step: <span className="text-white font-mono">{step}</span> / 5
                </div>
            </div>

            {/* Explanation */}
            <div className="mb-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-purple-400 font-bold mb-2 text-sm uppercase tracking-wider">Stage Boundaries & Pipelining</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                    {step === 0 && "Narrow transformations (map, filter) can be pipelined in the same stage. Click 'Next Step' to execute."}
                    {step === 1 && "Stage 1 executing! All narrow transformations run together - data flows through without writing to disk."}
                    {step === 2 && "Shuffle boundary! Data must be exchanged across executors. This forces a new stage."}
                    {step >= 3 && step < 5 && "Stage 2 executing after shuffle. reduceByKey triggered the shuffle, then mapValues pipelines with it."}
                    {step === 5 && "Job complete! Notice: Narrow transformations stayed in the same stage, shuffle created a stage boundary."}
                </p>
            </div>

            {/* DAG Visualization */}
            <div className="flex-1 flex items-center justify-center gap-8">
                {/* Stage 1 */}
                <div className="flex flex-col items-start">
                    <div className="mb-4 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${stage1Status === 'pending' ? 'bg-slate-600' :
                            stage1Status === 'running' ? 'bg-blue-500 animate-pulse' :
                                'bg-emerald-500'
                            }`}></div>
                        <h3 className="text-lg font-bold text-white">Stage 1</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${stage1Status === 'pending' ? 'bg-slate-700 text-slate-400' :
                            stage1Status === 'running' ? 'bg-blue-600 text-white' :
                                'bg-emerald-600 text-white'
                            }`}>
                            {stage1Status.toUpperCase()}
                        </span>
                    </div>

                    <div className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700 w-80">
                        <div className="space-y-3">
                            {stage1Transformations.map((trans, i) => {
                                const status = getTransformationStatus(1, i);
                                return (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${status.completed ? 'bg-emerald-400' :
                                            status.active ? 'bg-blue-400 animate-pulse' :
                                                'bg-slate-600'
                                            }`}></div>
                                        <code className={`text-sm font-mono ${status.completed ? 'text-emerald-300' :
                                            status.active ? 'text-blue-300' :
                                                'text-slate-500'
                                            }`}>
                                            {trans.name}
                                        </code>
                                        {i < stage1Transformations.length - 1 && (
                                            <div className="ml-auto text-blue-400 text-xs">→ narrow</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-700">
                            <div className="text-xs text-slate-400">
                                All transformations <strong className="text-blue-300">pipeline together</strong> - no disk I/O
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shuffle Boundary */}
                <div className="flex flex-col items-center gap-4">
                    <div className={`text-sm font-bold px-4 py-2 rounded-lg border-2 transition-all ${shuffleComplete ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' :
                        shuffleActive ? 'bg-orange-500/20 border-orange-500 text-orange-300 animate-pulse' :
                            'bg-slate-700 border-slate-600 text-slate-400'
                        }`}>
                        SHUFFLE
                    </div>
                    <div className="flex flex-col items-center text-xs text-slate-500 max-w-[150px] text-center">
                        <div className="font-mono text-orange-400 mb-1">Stage Boundary</div>
                        <div>Data written to disk & redistributed across cluster</div>
                    </div>
                    <div className={`w-1 h-16 ${shuffleActive ? 'bg-orange-500' : 'bg-slate-700'} transition-all`}></div>
                </div>

                {/* Stage 2 */}
                <div className="flex flex-col items-start">
                    <div className="mb-4 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${stage2Status === 'pending' ? 'bg-slate-600' :
                            stage2Status === 'running' ? 'bg-blue-500 animate-pulse' :
                                'bg-emerald-500'
                            }`}></div>
                        <h3 className="text-lg font-bold text-white">Stage 2</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${stage2Status === 'pending' ? 'bg-slate-700 text-slate-400' :
                            stage2Status === 'running' ? 'bg-blue-600 text-white' :
                                'bg-emerald-600 text-white'
                            }`}>
                            {stage2Status.toUpperCase()}
                        </span>
                    </div>

                    <div className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700 w-80">
                        <div className="space-y-3">
                            {stage2Transformations.map((trans, i) => {
                                const status = getTransformationStatus(2, i);
                                return (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${status.completed ? 'bg-emerald-400' :
                                            status.active ? 'bg-blue-400 animate-pulse' :
                                                'bg-slate-600'
                                            }`}></div>
                                        <code className={`text-sm font-mono ${status.completed ? 'text-emerald-300' :
                                            status.active ? 'text-blue-300' :
                                                'text-slate-500'
                                            }`}>
                                            {trans.name}
                                        </code>
                                        {i === 0 && (
                                            <div className="ml-auto text-orange-400 text-xs">← wide</div>
                                        )}
                                        {i > 0 && (
                                            <div className="ml-auto text-blue-400 text-xs">→ narrow</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-700">
                            <div className="text-xs text-slate-400">
                                <strong className="text-orange-300">reduceByKey</strong> triggered shuffle<br />
                                <strong className="text-blue-300">mapValues</strong> pipelines after
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-8 text-xs">
                <div className="flex items-center gap-2">
                    <div className="text-blue-400 font-mono">narrow →</div>
                    <span className="text-slate-400">Same stage (pipelined)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-orange-400 font-mono">wide ←</div>
                    <span className="text-slate-400">Stage boundary (shuffle)</span>
                </div>
            </div>
        </div>
    );
};
