import React from 'react';
import { Lightbulb } from 'lucide-react';
import { FACTS } from '../../constants/lakehouseConstants';
import * as Icons from 'lucide-react';

export const FactsPanel: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-slate-900/80">
        <Lightbulb className="text-yellow-400" size={18} />
        <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">Quick Concepts</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {FACTS.map((fact) => {
          const Icon = (Icons as any)[fact.iconName] || Icons.Info;
          return (
            <div key={fact.id} className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 hover:bg-slate-800/60 transition-colors group">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-900 rounded-md shrink-0 text-cyan-400 group-hover:text-cyan-300 group-hover:scale-110 transition-all shadow-lg shadow-black/20">
                  <Icon size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200 mb-1">{fact.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{fact.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};