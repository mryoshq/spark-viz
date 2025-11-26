import React from 'react';
import { CLARIFICATIONS } from '../../constants/lakehouseConstants';
import { X, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClarificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClarificationSidebar: React.FC<ClarificationSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 z-50 shadow-2xl overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <HelpCircle className="text-cyan-400" />
                  Concepts & Clarifications
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                {CLARIFICATIONS.map((item) => (
                  <div key={item.id} className="group">
                    <h3 className="text-lg font-semibold text-orange-400 mb-2 group-hover:text-orange-300 transition-colors">
                      {item.question}
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-sm">
                      {item.answer}
                    </p>
                    <div className="h-px w-full bg-slate-800 mt-6" />
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <h4 className="text-sm font-semibold text-slate-200 mb-2">Architecture Note</h4>
                <p className="text-xs text-slate-400">
                  This visualization simplifies the complex interactions in a modern data platform. In production, you might also see Orchestrators (Airflow), Streaming layers (Kafka), and Security Governance tools wrapping all these layers.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
