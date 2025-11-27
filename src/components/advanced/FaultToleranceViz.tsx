import React, { useState } from 'react';
import { RotateCcw, StepForward, AlertTriangle, CheckCircle, XCircle, AlertOctagon } from 'lucide-react';

interface Partition {
    id: number;
    status: 'active' | 'lost' | 'recomputing' | 'recovered';
}

interface RDD {
    id: number;
    name: string;
    dependencies: number[];
    partitions: Partition[];
    cached: boolean;
}

export const FaultToleranceViz: React.FC = () => {
    const [step, setStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const createInitialRDDs = (): RDD[] => [
        {
            id: 1,
            name: 'textFile("data.txt")',
            dependencies: [],
            partitions: [
                { id: 1, status: 'active' },
                { id: 2, status: 'active' },
                { id: 3, status: 'active' },
                { id: 4, status: 'active' },
            ],
            cached: false,
        },
        {
            id: 2,
            name: 'map(parseLine)',
            dependencies: [1],
            partitions: [
                { id: 1, status: 'active' },
                { id: 2, status: 'active' },
                { id: 3, status: 'active' },
                { id: 4, status: 'active' },
            ],
            cached: true, // This is cached!
        },
        {
            id: 3,
            name: 'reduceByKey(sum)',
            dependencies: [2],
            partitions: [
                { id: 1, status: 'active' },
                { id: 2, status: 'active' },
                { id: 3, status: 'active' },
                { id: 4, status: 'active' },
            ],
            cached: false,
        },
    ];

    const getRDDs = (): RDD[] => {
        const rdds = createInitialRDDs();

        if (step === 0) return rdds;

        // Step 1: Partition 2 fails on RDD 2 (intermediate)
        if (step >= 1) {
            rdds[1].partitions[1].status = 'lost';
            // Dependent partition in RDD 3 also becomes lost
            rdds[2].partitions[1].status = 'lost';
        }

        // Step 2: Start recomputing partition 2 on RDD 2
        if (step >= 2) {
            rdds[1].partitions[1].status = 'recomputing';
        }

        // Step 3: RDD 2 partition 2 recovered (from cache or recompute)
        if (step >= 3) {
            rdds[1].partitions[1].status = 'recovered';
            // Now start recomputing dependent partition in RDD 3
            rdds[2].partitions[1].status = 'recomputing';
        }

        // Step 4: All recovered
        if (step >= 4) {
            rdds[2].partitions[1].status = 'recovered';
        }

        return rdds;
    };

    const rdds = getRDDs();

    const handleNext = () => {
        if (step < 4 && !isAnimating) {
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

    const getPartitionColor = (status: Partition['status']) => {
        switch (status) {
            case 'active': return 'bg-emerald-500 border-emerald-600';
            case 'lost': return 'bg-red-500 border-red-600 animate-pulse';
            case 'recomputing': return 'bg-blue-500 border-blue-600';
            case 'recovered': return 'bg-green-500 border-green-600';
        }
    };

    const getRDDStatus = (rdd: RDD) => {
        if (rdd.partitions.some(p => p.status === 'lost')) return 'failed';
        if (rdd.partitions.some(p => p.status === 'recomputing')) return 'recomputing';
        if (rdd.partitions.some(p => p.status === 'recovered')) return 'recovered';
        return 'active';
    };

    const getRDDBorderColor = (status: string) => {
        switch (status) {
            case 'failed': return 'border-red-500';
            case 'recomputing': return 'border-blue-500';
            case 'recovered': return 'border-green-500';
            default: return 'border-slate-600';
        }
    };

    return (
        <div className="h-full flex flex-col p-6">
            {/* Controls */}
            <div className="mb-4 flex items-center gap-4 bg-slate-900 p-3 rounded-lg border border-slate-800">
                <button
                    onClick={handleNext}
                    disabled={step >= 4 || isAnimating}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${step >= 4 || isAnimating
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-500'
                        }`}
                >
                    <StepForward size={16} /> {isAnimating ? 'Animating...' : step === 0 ? 'Simulate Failure' : 'Next Step'}
                </button>

                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700"
                >
                    <RotateCcw size={16} /> Reset
                </button>

                <div className="ml-auto text-xs text-slate-400">
                    Step: <span className="text-white font-mono">{step}</span> / 4
                </div>
            </div>

            {/* Explanation */}
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <h3 className="text-red-400 font-bold mb-1 text-xs uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle size={14} />
                    Lineage-Based Fault Recovery
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                    {step === 0 && "RDD 2 is cached. If a partition fails, Spark uses lineage to recompute only the lost partition."}
                    {step === 1 && "Partition #2 lost on RDD 2! This affects dependent partition #2 on RDD 3."}
                    {step === 2 && "RDD 2 cached but partition lost. Recomputing from RDD 1."}
                    {step === 3 && "RDD 2 P#2 recovered! Now recomputing RDD 3 P#2 using recovered data."}
                    {step === 4 && "Full recovery! Only affected partitions recomputed."}
                </p>
            </div>

            {/* Lineage Graph */}
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                {rdds.map((rdd, index) => (
                    <div key={rdd.id} className="flex flex-col items-center w-full max-w-xl">
                        {/* RDD Container */}
                        <div className={`w-full bg-slate-900 rounded-lg border-2 p-3 transition-all ${getRDDBorderColor(getRDDStatus(rdd))}`}>
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h3 className="text-white font-bold text-sm">RDD {rdd.id}</h3>
                                    <code className="text-slate-300 text-xs">{rdd.name}</code>
                                </div>
                                <div className="flex items-center gap-2">
                                    {rdd.cached && (
                                        <div className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 text-xs">
                                            <span className="text-xs">CACHE</span>
                                        </div>
                                    )}
                                    {getRDDStatus(rdd) === 'failed' && (
                                        <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                                            <AlertOctagon size={12} />
                                            FAILED
                                        </div>
                                    )}
                                    {getRDDStatus(rdd) === 'recomputing' && (
                                        <div className="flex items-center gap-1 bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                                            <div className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            RECOVERING
                                        </div>
                                    )}
                                    {getRDDStatus(rdd) === 'recovered' && (
                                        <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                                            <CheckCircle size={12} />
                                            OK
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Partitions */}
                            <div className="flex gap-2">
                                {rdd.partitions.map((partition) => (
                                    <div key={partition.id} className="flex-1">
                                        <div className={`h-12 rounded-md border-2 flex flex-col items-center justify-center transition-all ${getPartitionColor(partition.status)}`}>
                                            <div className="text-white font-bold text-xs">P{partition.id}</div>
                                            <div className="text-[9px] text-white/80">
                                                {partition.status === 'lost' && 'X'}
                                                {partition.status === 'recomputing' && '...'}
                                                {partition.status === 'recovered' && 'OK'}
                                                {partition.status === 'active' && 'OK'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dependency Arrow */}
                        {index < rdds.length - 1 && (
                            <div className="flex flex-col items-center my-1">
                                <div className={`h-3 w-0.5 ${step >= 2 && index === 0 ? 'bg-blue-500' : 'bg-slate-600'}`}></div>
                                <div className={`text-[10px] font-mono px-2 py-0.5 rounded ${step >= 2 && index === 0 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-slate-800 text-slate-500'}`}>
                                    depends on
                                </div>
                                <div className={`h-3 w-0.5 ${step >= 2 && index === 0 ? 'bg-blue-500' : 'bg-slate-600'}`}></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-4 grid grid-cols-4 gap-2 text-[10px]">
                <div className="flex items-center gap-1.5 p-1.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                    <div className="w-2 h-2 bg-emerald-500 rounded"></div>
                    <div className="text-emerald-400 font-bold">Active</div>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded bg-red-500/10 border border-red-500/30">
                    <div className="w-2 h-2 bg-red-500 rounded"></div>
                    <div className="text-red-400 font-bold">Lost</div>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded bg-blue-500/10 border border-blue-500/30">
                    <div className="w-2 h-2 bg-blue-500 rounded"></div>
                    <div className="text-blue-400 font-bold">Recomputing</div>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded bg-green-500/10 border border-green-500/30">
                    <div className="w-2 h-2 bg-green-500 rounded"></div>
                    <div className="text-green-400 font-bold">Recovered</div>
                </div>
            </div>
        </div>
    );
};
