import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { CONCEPTS } from '../constants/advancedConstants';
import { ConceptType } from '../types/advancedTypes';
import * as Icons from 'lucide-react';
import { ShuffleViz } from '../components/advanced/ShuffleViz';
import { DAGViz } from '../components/advanced/DAGViz';
import { LazyEvalViz } from '../components/advanced/LazyEvalViz';
import { DataLocalityViz } from '../components/advanced/DataLocalityViz';
import { FaultToleranceViz } from '../components/advanced/FaultToleranceViz';
import { NetworkOverheadViz } from '../components/advanced/NetworkOverheadViz';
import { CatalystViz } from '../components/advanced/CatalystViz';

const AdvancedPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedConcept, setSelectedConcept] = useState<ConceptType>(ConceptType.SHUFFLE);

    const currentConcept = CONCEPTS.find(c => c.id === selectedConcept);

    const renderVisualization = () => {
        switch (selectedConcept) {
            case ConceptType.SHUFFLE:
                return <ShuffleViz />;
            case ConceptType.DAG:
                return <DAGViz />;
            case ConceptType.LAZY_EVAL:
                return <LazyEvalViz />;
            case ConceptType.DATA_LOCALITY:
                return <DataLocalityViz />;
            case ConceptType.FAULT_TOLERANCE:
                return <FaultToleranceViz />;
            case ConceptType.CATALYST:
                return <CatalystViz />;
            case ConceptType.NETWORK:
                return <NetworkOverheadViz />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 z-40 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
                        S
                    </div>
                    <h1 className="font-bold text-xl tracking-tight text-slate-100">
                        Advanced <span className="text-slate-400 font-light">Spark Concepts</span>
                    </h1>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors border border-slate-700"
                >
                    <Home size={18} className="text-cyan-400" />
                    <span className="hidden sm:inline">Home</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
                {/* Concept Tabs */}
                <aside className="w-80 bg-slate-900 border-r border-slate-800 overflow-y-auto p-4 space-y-2">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Select Concept</h2>

                    {CONCEPTS.map((concept) => {
                        const IconComponent = (Icons as any)[concept.icon] || Icons.Box;
                        const isSelected = selectedConcept === concept.id;

                        return (
                            <button
                                key={concept.id}
                                onClick={() => setSelectedConcept(concept.id)}
                                className={`w-full text-left p-4 rounded-lg transition-all border ${isSelected
                                    ? 'bg-orange-500/20 border-orange-500/50 shadow-lg shadow-orange-500/10'
                                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-orange-500/30' : 'bg-slate-700'}`}>
                                        <IconComponent size={20} className={isSelected ? 'text-orange-400' : 'text-slate-400'} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-semibold text-sm mb-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                            {concept.title}
                                        </h3>
                                        <p className="text-xs text-slate-400 leading-relaxed">{concept.description}</p>
                                        <div className="mt-2">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${concept.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                                                concept.difficulty === 'intermediate' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-purple-500/20 text-purple-400'
                                                }`}>
                                                {concept.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                    {isSelected && <ChevronRight size={16} className="text-orange-400 shrink-0 mt-1" />}
                                </div>
                            </button>
                        );
                    })}
                </aside>

                {/* Visualization Area */}
                <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
                    {/* Concept Header */}
                    <div className="p-6 border-b border-slate-800 bg-slate-900/30">
                        <h2 className="text-2xl font-bold text-white mb-2">{currentConcept?.title}</h2>
                        <p className="text-slate-400">{currentConcept?.description}</p>
                    </div>

                    {/* Visualization */}
                    <div className="flex-1 overflow-auto">
                        {renderVisualization()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdvancedPage;
