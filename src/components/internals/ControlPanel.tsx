import React from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';

interface ControlPanelProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  onPlayPause: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  currentStep,
  totalSteps,
  onPlayPause,
  onReset,
  onNext,
  onPrev
}) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl shadow-xl">
      
      <button 
        onClick={onPrev}
        disabled={currentStep === 0}
        className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        onClick={onPlayPause}
        className="p-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-95"
      >
        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
      </button>

      <button 
        onClick={onNext}
        disabled={currentStep === totalSteps - 1}
        className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      <div className="w-px h-8 bg-slate-700 mx-2"></div>

      <button 
        onClick={onReset}
        className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
        title="Reset"
      >
        <RotateCcw size={20} />
      </button>

      <div className="text-xs font-mono text-slate-500 ml-2">
        STEP {currentStep + 1} / {totalSteps}
      </div>
    </div>
  );
};

export default ControlPanel;
