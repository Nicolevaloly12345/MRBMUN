import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Plus, Minus, AlertTriangle, MessageSquare, StickyNote, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function PointTracker() {
  const [stats, setStats] = useLocalStorage('mun-point-tracker-stats', {
    participations: 0,
    warnings: 0
  });

  const [notes, setNotes] = useLocalStorage('mun-session-notes', '');

  const updateStat = (type: 'participations' | 'warnings', delta: number) => {
    setStats(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  const clearNotes = () => setNotes('');

  return (
    <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6 pb-20">
      {/* Counters Panel */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* Participations Card */}
        <div className="bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-5 border border-[#E5E7EB] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[100px] -z-10" />
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <MessageSquare size={20} />
            </div>
            <h3 className="font-bold text-gray-700 uppercase tracking-wide text-sm">Participaciones</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <button 
              onClick={() => updateStat('participations', -1)}
              className="p-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <Minus size={20} />
            </button>
            
            <motion.div 
              key={stats.participations}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-serif font-bold text-burgundy"
            >
              {stats.participations}
            </motion.div>
            
            <button 
              onClick={() => updateStat('participations', 1)}
              className="p-3 rounded-xl border-2 border-emerald-500 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Warnings Card */}
        <div className="bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-5 border border-[#E5E7EB] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-[100px] -z-10" />
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 text-red-700 rounded-lg">
              <AlertTriangle size={20} />
            </div>
            <h3 className="font-bold text-gray-700 uppercase tracking-wide text-sm">Amonestaciones</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <button 
              onClick={() => updateStat('warnings', -1)}
              className="p-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <Minus size={20} />
            </button>
            
            <motion.div 
              key={stats.warnings}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-serif font-bold text-burgundy"
            >
              {stats.warnings}
            </motion.div>
            
            <button 
              onClick={() => updateStat('warnings', 1)}
              className="p-3 rounded-xl border-2 border-red-500 text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          
           {stats.warnings >= 3 && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 text-xs rounded-lg font-bold text-center border border-red-200">
              PRECAUCIÓN: Máximo de amonestaciones alcanzado.
            </div>
          )}
        </div>

      </div>

      {/* Quick Notes Panel */}
      <div className="lg:col-span-2 bg-[#FFFDF5] rounded-lg p-5 shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#F1E8C1] flex flex-col h-full min-h-[400px]">
        <div className="flex items-center justify-between mb-4 border-b border-[#F1E8C1] pb-4">
          <div className="flex items-center gap-2 text-burgundy">
            <StickyNote size={20} className="text-[#D4B741]" />
            <h3 className="font-serif font-bold text-lg">Notas Rápidas</h3>
          </div>
          <button 
            onClick={clearNotes}
            title="Borrar Notas"
            className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anota puntos de delegados, formación de bloques o respuestas inmediatas. Estas notas persisten entre sesiones."
          className="flex-1 w-full bg-transparent resize-none outline-none text-burgundy/90 leading-relaxed font-sans text-sm focus:ring-0 placeholder:text-burgundy/30"
        />
      </div>
    </div>
  );
}
