import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './src/pages/WelcomePage';
import CoreInternalsPage from './src/pages/CoreInternalsPage';
import InternalsPage from './src/pages/InternalsPage';
import LakehousePage from './src/pages/LakehousePage';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/core-internals" element={<CoreInternalsPage />} />
                <Route path="/internals" element={<InternalsPage />} />
                <Route path="/lakehouse" element={<LakehousePage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
