import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SPARK_STEPS } from '../constants/internalsConstants';
import Diagram from '../components/internals/Diagram';
import ControlPanel from '../components/internals/ControlPanel';
import { Home } from 'lucide-react';

const InternalsPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const currentStep = SPARK_STEPS[currentStepIndex];

    const nextStep = useCallback(() => {
        setCurrentStepIndex((prev) => {
            if (prev >= SPARK_STEPS.length - 1) {
                setIsPlaying(false);
                return prev;
            }
            return prev + 1;
        });
    }, []);

    const prevStep = () => {
        setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : 0));
        setIsPlaying(false);
    };

    const reset = () => {
        setIsPlaying(false);
        setCurrentStepIndex(0);
    };

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                nextStep();
            }, 2000); // Time per step - faster animation
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, nextStep]);

    return (
        <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center relative overflow-hidden">

            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[100px]" />
            </div>

            {/* Header */}
            <header className="w-full px-6 py-6 flex justify-between items-end z-10">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Spark Internals
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm max-w-md">
                        Interactive visualization of the Apache Spark execution engine.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                    >
                        <Home size={16} />
                        <span className="text-sm font-medium">Home</span>
                    </button>
                    <div className="hidden md:inline-flex items-center px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        System Ready
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full px-6 py-4 flex flex-col lg:flex-row gap-6 z-10">

                {/* Left: Visualization */}
                <div className="flex-1 flex flex-col relative">
                    <div className="flex-1 min-h-[400px] lg:min-h-[600px]">
                        <Diagram
                            step={currentStep}
                        />
                    </div>

                    {/* Controls positioned overlaying bottom center of diagram area */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-max">
                        <ControlPanel
                            isPlaying={isPlaying}
                            currentStep={currentStepIndex}
                            totalSteps={SPARK_STEPS.length}
                            onPlayPause={() => setIsPlaying(!isPlaying)}
                            onReset={reset}
                            onNext={nextStep}
                            onPrev={prevStep}
                        />
                    </div>
                </div>

                {/* Right: Information */}
                <div className="w-full lg:w-96 flex flex-col gap-4">

                    {/* Step Description Card */}
                    <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-white">{currentStep.title}</h2>
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 font-mono text-sm">
                                {currentStepIndex + 1}
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {currentStep.description}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {currentStep.activeComponents.map(comp => (
                                <span key={comp} className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-800 text-slate-500 border border-slate-700">
                                    {comp}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default InternalsPage;
