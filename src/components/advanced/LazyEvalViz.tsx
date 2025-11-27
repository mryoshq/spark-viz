import React, { useState } from 'react';
import { RotateCcw, Plus, Play, CheckCircle } from 'lucide-react';

interface Operation {
    id: number;
    name: string;
    type: 'transformation' | 'action';
    code: string;
    inPlan: boolean;
    executed: boolean;
}

export const LazyEvalViz: React.FC = () => {
    const [operations, setOperations] = useState<Operation[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionComplete, setExecutionComplete] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const availableTransformations = [
        { name: 'Read Data', code: 'val data = sc.textFile("data.txt")', type: 'transformation' as const },
        { name: 'Map', code: '.map(line => line.split(","))', type: 'transformation' as const },
        { name: 'Filter', code: '.filter(arr => arr.length > 2)', type: 'transformation' as const },
        { name: 'Map Values', code: '.map(arr => (arr(0), arr(1).toInt))', type: 'transformation' as const },
    ];

    const availableActions = [
        { name: 'Collect', code: '.collect()', type: 'action' as const },
        { name: 'Count', code: '.count()', type: 'action' as const },
        { name: 'Take', code: '.take(10)', type: 'action' as const },
    ];

    const addTransformation = () => {
        if (currentStep < availableTransformations.length) {
            const trans = availableTransformations[currentStep];
            setOperations([
                ...operations,
                {
                    id: Date.now(),
                    name: trans.name,
                    code: trans.code,
                    type: trans.type,
                    inPlan: true,
                    executed: false,
                },
            ]);
            setCurrentStep(currentStep + 1);
        }
    };

    const addAction = (actionIndex: number) => {
        if (operations.length > 0 && !isExecuting && !executionComplete) {
            const action = availableActions[actionIndex];
            const newOp: Operation = {
                id: Date.now(),
                name: action.name,
                code: action.code,
                type: action.type,
                inPlan: true,
                executed: false,
            };
            setOperations([...operations, newOp]);

            // Trigger execution after a short delay
            setTimeout(() => executeJob(), 500);
        }
    };

    const executeJob = () => {
        setIsExecuting(true);
        let executionStep = 0;

        const interval = setInterval(() => {
            executionStep++;
            setOperations(ops =>
                ops.map((op, index) => {
                    if (index < executionStep) {
                        return { ...op, executed: true };
                    }
                    return op;
                })
            );

            if (executionStep >= operations.length + 1) {
                clearInterval(interval);
                setIsExecuting(false);
                setExecutionComplete(true);
            }
        }, 600);
    };

    const reset = () => {
        setOperations([]);
        setIsExecuting(false);
        setExecutionComplete(false);
        setCurrentStep(0);
    };

    const hasAction = operations.some(op => op.type === 'action');

    return (
        <div className="h-full flex flex-col p-8">
            {/* Controls */}
            <div className="mb-8 flex items-center gap-4 bg-slate-900 p-4 rounded-lg border border-slate-800">
                <button
                    onClick={addTransformation}
                    disabled={currentStep >= availableTransformations.length || hasAction}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${currentStep >= availableTransformations.length || hasAction
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-500'
                        }`}
                >
                    <Plus size={18} /> Add Transformation
                </button>

                <button
                    onClick={reset}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700"
                >
                    <RotateCcw size={18} /> Reset
                </button>

                <div className="ml-auto text-sm">
                    <span className="text-slate-400">Operations in plan: </span>
                    <span className="text-white font-mono">{operations.length}</span>
                    <span className="mx-2 text-slate-600">|</span>
                    <span className="text-slate-400">Executed: </span>
                    <span className="text-emerald-400 font-mono">{operations.filter(o => o.executed).length}</span>
                </div>
            </div>

            {/* Explanation */}
            <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <h3 className="text-amber-400 font-bold mb-2 text-sm uppercase tracking-wider">Lazy Evaluation</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                    {operations.length === 0 && "Add transformations to build your execution plan. Nothing executes yet!"}
                    {operations.length > 0 && !hasAction && "Transformations are just building a plan (DAG). No computation happens until you call an ACTION."}
                    {hasAction && !isExecuting && !executionComplete && "Action detected! Execution will start..."}
                    {isExecuting && "Now executing! Spark processes all transformations in the optimal order."}
                    {executionComplete && "Execution complete! Notice how transformations were lazy - they only ran when the action required them."}
                </p>
            </div>

            <div className="flex-1 flex gap-8">
                {/* Left: Code/Plan View */}
                <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Execution Plan</h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${executionComplete ? 'bg-emerald-600 text-white' :
                            isExecuting ? 'bg-blue-600 text-white animate-pulse' :
                                hasAction ? 'bg-amber-600 text-white' :
                                    'bg-slate-700 text-slate-400'
                            }`}>
                            {executionComplete ? 'COMPLETED' :
                                isExecuting ? 'EXECUTING' :
                                    hasAction ? 'READY' :
                                        'BUILDING'}
                        </div>
                    </div>

                    {operations.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <div className="text-4xl mb-4">📋</div>
                            <p>No operations yet. Start adding transformations!</p>
                        </div>
                    ) : (
                        <div className="space-y-2 font-mono text-sm">
                            {operations.map((op, index) => (
                                <div
                                    key={op.id}
                                    className={`p-3 rounded-lg border-2 transition-all ${op.executed
                                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                        : op.type === 'action'
                                            ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                                            : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 min-w-[120px]">
                                            <div className={`w-2 h-2 rounded-full ${op.executed ? 'bg-emerald-400' :
                                                op.type === 'action' ? 'bg-orange-400' :
                                                    'bg-blue-400'
                                                }`}></div>
                                            <span className={`text-xs px-2 py-0.5 rounded ${op.type === 'action'
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-blue-600 text-white'
                                                }`}>
                                                {op.type === 'action' ? 'ACTION' : 'TRANSFORM'}
                                            </span>
                                        </div>
                                        <code className="flex-1">{op.code}</code>
                                        {op.executed && (
                                            <CheckCircle size={12} className="text-emerald-400" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Actions Panel */}
                <div className="w-80 bg-slate-900 rounded-xl border border-slate-800 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Trigger Execution</h3>

                    {!hasAction && operations.length > 0 ? (
                        <div className="space-y-3">
                            <p className="text-sm text-slate-400 mb-4">
                                Choose an action to execute the plan:
                            </p>
                            {availableActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => addAction(index)}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium transition-colors border border-orange-500"
                                >
                                    <Play size={16} />
                                    <div className="flex-1 text-left">
                                        <div className="font-bold">{action.name}</div>
                                        <code className="text-xs opacity-80">{action.code}</code>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : operations.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <div className="text-slate-400 mb-2 text-sm">Ready</div>
                            <p className="text-sm">Add transformations first</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-slate-800 rounded-lg p-4 text-center">
                                {isExecuting && (
                                    <>
                                        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                                        <p className="text-blue-300 font-bold">Executing...</p>
                                    </>
                                )}
                                {executionComplete && (
                                    <>
                                        <CheckCircle size={32} className="text-emerald-400 mb-2" />
                                        <p className="text-emerald-300 font-bold">Execution Complete!</p>
                                        <p className="text-xs text-slate-400 mt-2">All operations processed</p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Key Concept</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            <strong className="text-white">Transformations</strong> are lazy - they build a plan.
                            <br /><br />
                            <strong className="text-white">Actions</strong> trigger execution of the entire DAG.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
