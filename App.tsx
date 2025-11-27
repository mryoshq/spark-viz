import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './src/pages/WelcomePage';
const CoreInternalsPage = lazy(() => import('./src/pages/CoreInternalsPage'));
const InternalsPage = lazy(() => import('./src/pages/InternalsPage'));
const LakehousePage = lazy(() => import('./src/pages/LakehousePage'));
const AdvancedPage = lazy(() => import('./src/pages/AdvancedPage'));

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={
                <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                    <div className="text-slate-400">Loading...</div>
                </div>
            }>
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/core-internals" element={<CoreInternalsPage />} />
                    <Route path="/internals" element={<InternalsPage />} />
                    <Route path="/lakehouse" element={<LakehousePage />} />
                    <Route path="/advanced" element={<AdvancedPage />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default App;
