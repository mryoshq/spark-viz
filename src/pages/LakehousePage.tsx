import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Home } from 'lucide-react';
import { ArchitectureDiagram } from '../components/lakehouse/ArchitectureDiagram';
import { LayerDetail } from '../components/lakehouse/LayerDetail';
import { FactsPanel } from '../components/lakehouse/FactsPanel';
import { ClarificationSidebar } from '../components/lakehouse/ClarificationSidebar';
import { ArchitectureLayer, LayerType } from '../types/lakehouseTypes';
import { ARCHITECTURE_LAYERS } from '../constants/lakehouseConstants';

const LakehousePage: React.FC = () => {
    const navigate = useNavigate();
    // Initialize with COMPUTE layer selected to show Spark immediately as requested
    const [selectedLayer, setSelectedLayer] = useState<ArchitectureLayer | null>(
        ARCHITECTURE_LAYERS.find(l => l.id === LayerType.COMPUTE) || null
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col overflow-hidden">
            {/* Navbar */}
            <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 md:px-10 z-40 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
                        S
                    </div>
                    <h1 className="font-bold text-xl tracking-tight text-slate-100">Spark<span className="text-slate-500 font-light">Lakehouse</span></h1>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors border border-slate-700"
                    >
                        <Home size={18} className="text-cyan-400" />
                        <span className="hidden sm:inline">Home</span>
                    </button>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors border border-slate-700"
                    >
                        <Info size={18} className="text-cyan-400" />
                        <span className="hidden sm:inline">More Info</span>
                    </button>
                </div>
            </header>

            {/* Main Content Grid */}
            <main className="flex-1 relative flex flex-col lg:flex-row overflow-hidden">

                {/* Left Sidebar: Facts Panel */}
                <aside className="hidden lg:flex w-[350px] bg-slate-950 border-r border-slate-800 z-30 flex-col h-full shadow-2xl">
                    <div className="flex-1 p-4 overflow-hidden">
                        <FactsPanel />
                    </div>
                </aside>

                {/* Center: Diagram Area */}
                <section className="flex-1 relative overflow-y-auto lg:overflow-hidden p-4 bg-slate-950 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900/0 to-slate-950 pointer-events-none"></div>

                    <div className="w-full h-full max-w-4xl flex items-center justify-center">
                        <ArchitectureDiagram
                            selectedLayer={selectedLayer}
                            onSelectLayer={setSelectedLayer}
                        />
                    </div>
                </section>

                {/* Right Sidebar: Layer Details */}
                <aside className="w-full lg:w-[350px] bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 z-30 flex flex-col h-[40vh] lg:h-auto shadow-2xl">
                    <div className="flex-1 p-4 overflow-hidden h-full">
                        <LayerDetail
                            layer={selectedLayer}
                            onClose={() => setSelectedLayer(null)}
                        />
                    </div>
                    {/* Mobile only Facts Panel */}
                    <div className="lg:hidden h-[200px] p-4 border-t border-slate-800">
                        <FactsPanel />
                    </div>
                </aside>

            </main>

            {/* Overlays */}
            <ClarificationSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* AIAssistant removed */}
        </div>
    );
};

export default LakehousePage;
