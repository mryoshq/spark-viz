import React, { useState } from 'react';
import { RotateCcw, StepForward, Zap, TrendingDown } from 'lucide-react';

interface OptimizationStep {
    id: number;
    name: string;
    rule: string;
    before: string;
    after: string;
    improvement: string;
    applied: boolean;
}

export const CatalystViz: React.FC = () => {
    const [step, setStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const optimizations: OptimizationStep[] = [
        {
            id: 1,
            name: 'Predicate Pushdown',
            rule: 'Move filters closer to data source',
            before: 'Read All → Filter age > 25',
            after: 'Read (WHERE age > 25)',
            improvement: '90% less data read',
            applied: false,
        },
        {
            id: 2,
            name: 'Column Pruning',
            rule: 'Read only needed columns',
            before: 'Read (id, name, age, address, email)',
            after: 'Read (id, name, age)',
            improvement: '60% less I/O',
            applied: false,
        },
        {
            id: 3,
            name: 'Constant Folding',
            rule: 'Evaluate constants at compile time',
            before: 'WHERE year = 2024 - 1',
            after: 'WHERE year = 2023',
            improvement: 'No runtime computation',
            applied: false,
        },
        {
            id: 4,
            name: 'Join Reordering',
            rule: 'Optimize join order for smallest result',
            before: 'bigTable JOIN smallTable',
            after: 'smallTable JOIN bigTable (broadcast)',
            improvement: '80% less shuffle',
            applied: false,
        },
    ];

    const getOptimizations = (): OptimizationStep[] => {
        return optimizations.map((opt, index) => ({
            ...opt,
            applied: index < step,
        }));
    };

    const currentOpts = getOptimizations();
    const totalImprovement = step > 0 ? Math.min(95, step * 20 + 15) : 0;

    const handleNext = () => {
        if (step < optimizations.length && !isAnimating) {
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

    const currentOpt = step > 0 && step <= optimizations.length ? optimizations[step - 1] : null;

    return (
        <div className="h-full flex flex-col p-6">
            {/* Controls */}
            <div className="mb-4 flex items-center gap-4 bg-slate-900 p-3 rounded-lg border border-slate-800">
                <button
                    onClick={handleNext}
                    disabled={step >= optimizations.length || isAnimating}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${step >= optimizations.length || isAnimating
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-yellow-600 text-white hover:bg-yellow-500'
                        }`}
                >
                    <StepForward size={16} /> {isAnimating ? 'Optimizing...' : 'Apply Next'}
                </button>

                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700"
                >
                    <RotateCcw size={16} /> Reset
                </button>

                <div className="ml-auto flex items-center gap-4 text-xs">
                    <div className="text-slate-400">
                        Optimizations: <span className="text-white font-mono">{step}</span> / {optimizations.length}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <TrendingDown size={12} className="text-emerald-400" />
                        <span className="text-slate-400">Performance:</span>
                        <span className="text-emerald-400 font-mono font-bold">+{totalImprovement}%</span>
                    </div>
                </div>
            </div>

            {/* Explanation */}
            <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <h3 className="text-yellow-400 font-bold mb-1 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Zap size={14} />
                    Catalyst Query Optimizer
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                    {step === 0 && "Catalyst transforms your query through rule-based optimizations before execution. Click to apply optimizations."}
                    {currentOpt && `${currentOpt.name}: ${currentOpt.rule} → ${currentOpt.improvement}`}
                    {step === optimizations.length && `Optimization complete! Query runs ${totalImprovement}% faster with less data movement and I/O.`}
                </p>
            </div>

            <div className="flex-1 flex gap-4">
                {/* Left: Query Evolution */}
                <div className="flex-1 space-y-3">
                    {/* Original Query */}
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-white">Original Query</h3>
                            <div className="text-xs bg-red-600 text-white px-2 py-0.5 rounded">Unoptimized</div>
                        </div>
                        <div className="bg-slate-950 rounded p-3 font-mono text-xs text-slate-300">
                            <div>SELECT id, name, age</div>
                            <div>FROM users</div>
                            <div>WHERE age &gt; 25 AND year = 2024 - 1</div>
                            <div>JOIN orders ON users.id = orders.user_id</div>
                        </div>
                    </div>

                    {/* Optimization Steps */}
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
                        <h3 className="text-sm font-bold text-white mb-3">Applied Optimizations</h3>
                        <div className="space-y-2">
                            {currentOpts.map((opt) => (
                                <div
                                    key={opt.id}
                                    className={`p-3 rounded-lg border transition-all ${opt.applied
                                        ? 'bg-emerald-500/20 border-emerald-500'
                                        : 'bg-slate-800 border-slate-700 opacity-50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${opt.applied ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                                            <div className="font-bold text-xs text-white">{opt.name}</div>
                                        </div>
                                        {opt.applied && (
                                            <div className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">
                                                {opt.improvement}
                                            </div>
                                        )}
                                    </div>
                                    {opt.applied && (
                                        <>
                                            <div className="text-[10px] text-slate-400 mb-2">{opt.rule}</div>
                                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                                                <div className="bg-red-500/10 border border-red-500/30 rounded p-1.5">
                                                    <div className="text-red-400 font-bold mb-1">Before:</div>
                                                    <div className="text-slate-300 font-mono">{opt.before}</div>
                                                </div>
                                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-1.5">
                                                    <div className="text-emerald-400 font-bold mb-1">After:</div>
                                                    <div className="text-slate-300 font-mono">{opt.after}</div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Stats & Physical Plan */}
                <div className="w-96 space-y-4">
                    {/* Performance Metrics */}
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
                        <h3 className="text-sm font-bold text-white mb-3">Performance Impact</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Data Scanned</span>
                                    <span className={step > 0 ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                                        {step > 0 ? '10 MB' : '100 MB'}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-700 ${step > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                        style={{ width: step > 0 ? '10%' : '100%' }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Shuffle Size</span>
                                    <span className={step >= 4 ? 'text-emerald-400 font-bold' : 'text-orange-400'}>
                                        {step >= 4 ? '20 MB' : '100 MB'}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-700 ${step >= 4 ? 'bg-emerald-500' : 'bg-orange-500'}`}
                                        style={{ width: step >= 4 ? '20%' : '100%' }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Execution Time</span>
                                    <span className={step > 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                                        {step > 0 ? '2.3s' : '45s'}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-700 ${step > 0 ? 'bg-emerald-500' : 'bg-slate-600'}`}
                                        style={{ width: step > 0 ? '5%' : '100%' }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-700">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Overall Speedup:</span>
                                <span className="text-lg font-bold text-emerald-400">
                                    {totalImprovement > 0 ? `${totalImprovement}%` : '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Optimization Phases */}
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
                        <h3 className="text-sm font-bold text-white mb-3">Catalyst Phases</h3>
                        <div className="space-y-2 text-xs">
                            <div className={`p-2 rounded border ${step >= 1 ? 'bg-blue-500/20 border-blue-500' : 'bg-slate-800 border-slate-700'}`}>
                                <div className="font-bold text-white">1. Analysis</div>
                                <div className="text-[10px] text-slate-400">Resolve references & types</div>
                            </div>
                            <div className={`p-2 rounded border ${step >= 2 ? 'bg-purple-500/20 border-purple-500' : 'bg-slate-800 border-slate-700'}`}>
                                <div className="font-bold text-white">2. Logical Optimization</div>
                                <div className="text-[10px] text-slate-400">Apply rule-based transforms</div>
                            </div>
                            <div className={`p-2 rounded border ${step >= 3 ? 'bg-yellow-500/20 border-yellow-500' : 'bg-slate-800 border-slate-700'}`}>
                                <div className="font-bold text-white">3. Physical Planning</div>
                                <div className="text-[10px] text-slate-400">Generate execution strategies</div>
                            </div>
                            <div className={`p-2 rounded border ${step >= 4 ? 'bg-emerald-500/20 border-emerald-500' : 'bg-slate-800 border-slate-700'}`}>
                                <div className="font-bold text-white">4. Code Generation</div>
                                <div className="text-[10px] text-slate-400">Compile to optimized bytecode</div>
                            </div>
                        </div>
                    </div>

                    {/* Key Rules */}
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5">Common Rules</h4>
                        <div className="space-y-0.5 text-[10px] text-slate-300">
                            <div>• Predicate Pushdown</div>
                            <div>• Column Pruning</div>
                            <div>• Constant Folding</div>
                            <div>• Join Reordering</div>
                            <div>• Filter Combination</div>
                            <div>• Projection Collapsing</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center justify-center gap-6 text-[10px]">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-slate-400">Before optimization</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                    <span className="text-slate-400">After optimization</span>
                </div>
            </div>
        </div>
    );
};
