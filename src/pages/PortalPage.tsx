import React, { useState, useEffect } from 'react';
import { Menu, Zap, PenTool, Award, X, ChevronRight, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from '../components/Sidebar';
import DelegatesBible from '../components/modules/DelegatesBible';
import SpeechBuilder from '../components/modules/SpeechBuilder';
import GlobalResearchCenter from '../components/modules/GlobalResearchCenter';
import PointTracker from '../components/modules/PointTracker';
import TimerWidget from '../components/TimerWidget';

import HandbookViewer from '../components/modules/HandbookViewer';
import AgendaViewer from '../components/modules/AgendaViewer';
import CertificateGenerator from '../components/modules/CertificateGenerator';

export type ActiveTab = 'bible' | 'speech' | 'research' | 'tracker' | 'handbook' | 'agenda' | 'certificate';

type NotificationType = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent';
  autoHide?: boolean;
};

export default function PortalPage({ onExitPortal }: { onExitPortal: () => void }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('bible');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(false);

  // Add a simulation for contextual notifications and quick notes
  useEffect(() => {
    // Simulate a suggested motion notification after 30 seconds
    const timer = setTimeout(() => {
      addNotification('Moción Sugerida', 'El debate se ha estancado. Sugerencia: Moción para un Caucus Inmoderado de 5 minutos.', 'info');
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  const addNotification = (title: string, message: string, type: 'info' | 'warning' | 'urgent' = 'info', autoHide = true) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, title, message, type, autoHide }]);
    
    if (autoHide) {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleTimeWarning = () => {
    addNotification('Atención', 'Quedan 10 segundos para finalizar su discurso.', 'warning');
  };

  const handleTimeUp = () => {
    addNotification('Tiempo Terminado', 'No olvide guardar un resumen en sus Notas Rápidas 📝', 'urgent', false);
  };

  const getModuleTitle = () => {
    switch (activeTab) {
      case 'bible': return "La Biblia del Delegado";
      case 'speech': return "Frases Poderosas";
      case 'research': return "Centro de Investigación";
      case 'tracker': return "Toma tus apuntes";
      case 'handbook': return "Handbook MRBMUN";
      case 'agenda': return "Agenda";
      case 'certificate': return "Generador de Certificados";
    }
  };

  return (
    <div className="flex bg-snow h-[100dvh] w-full font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-burgundy/20 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        closeSidebar={() => setIsSidebarOpen(false)}
        onExitPortal={onExitPortal}
      />

      <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden relative">
        <header className="px-8 py-0 h-20 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 -ml-2 text-burgundy hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-serif font-semibold text-burgundy hidden sm:block">
              {getModuleTitle()}
            </h1>
          </div>
          
          <div className="flex items-center gap-4 relative">
             {/* Quick Access Menu */}
             <div className="relative">
               <button 
                 onClick={() => setIsQuickAccessOpen(!isQuickAccessOpen)}
                 className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-burgundy rounded-lg border border-gray-200 transition-colors"
                 title="Acceso Rápido"
               >
                 <Zap size={18} className="text-gold" />
                 <span className="hidden lg:inline text-sm font-medium">Acceso Rápido</span>
               </button>

               <AnimatePresence>
                 {isQuickAccessOpen && (
                   <>
                     <div 
                       className="fixed inset-0 z-40" 
                       onClick={() => setIsQuickAccessOpen(false)} 
                     />
                     <motion.div 
                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
                       className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2"
                     >
                       <div className="px-3 py-1 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                         Herramientas Rápidas
                       </div>
                       <button 
                         onClick={() => { setActiveTab('speech'); setIsQuickAccessOpen(false); }}
                         className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-burgundy group"
                       >
                         <div className="p-1.5 rounded-md bg-burgundy/5 group-hover:bg-burgundy/10 text-burgundy transition-colors">
                           <PenTool size={16} />
                         </div>
                         <span className="text-sm font-medium">Frases Poderosas</span>
                       </button>
                       <button 
                         onClick={() => { setActiveTab('tracker'); setIsQuickAccessOpen(false); }}
                         className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-burgundy group"
                       >
                         <div className="p-1.5 rounded-md bg-gold/10 group-hover:bg-gold/20 text-gold transition-colors">
                           <Award size={16} />
                         </div>
                         <span className="text-sm font-medium">Toma tus apuntes</span>
                       </button>
                     </motion.div>
                   </>
                 )}
               </AnimatePresence>
             </div>

             <div className="hidden lg:block">
               <TimerWidget onTimeUp={handleTimeUp} onTimeWarning={handleTimeWarning} />
             </div>
             <h2 className="font-serif font-bold text-burgundy sm:hidden">
               MRBMUN <span className="text-gold">26</span>
             </h2>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto min-h-full">
            <div className="mb-6 lg:hidden">
              <TimerWidget onTimeUp={handleTimeUp} onTimeWarning={handleTimeWarning} />
            </div>

            {/* Notifications Feed */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
              <AnimatePresence>
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className={`
                      pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border w-80 relative overflow-hidden
                      ${notif.type === 'info' ? 'bg-white border-blue-100' : ''}
                      ${notif.type === 'warning' ? 'bg-amber-50 border-amber-200' : ''}
                      ${notif.type === 'urgent' ? 'bg-red-50 border-red-200' : ''}
                    `}
                  >
                    <div className={`
                      shrink-0 p-2 rounded-full mt-0.5
                      ${notif.type === 'info' ? 'bg-blue-100 text-blue-600' : ''}
                      ${notif.type === 'warning' ? 'bg-amber-200 text-amber-700' : ''}
                      ${notif.type === 'urgent' ? 'bg-red-200 text-red-600' : ''}
                    `}>
                      <Bell size={16} />
                    </div>
                    <div className="flex-1 pr-6">
                      <h4 className={`text-sm font-bold mb-0.5 
                        ${notif.type === 'info' ? 'text-gray-900' : ''}
                        ${notif.type === 'warning' ? 'text-amber-900' : ''}
                        ${notif.type === 'urgent' ? 'text-red-900' : ''}
                      `}>
                        {notif.title}
                      </h4>
                      <p className={`text-xs 
                        ${notif.type === 'info' ? 'text-gray-600' : ''}
                        ${notif.type === 'warning' ? 'text-amber-800' : ''}
                        ${notif.type === 'urgent' ? 'text-red-800' : ''}
                      `}>
                        {notif.message}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeNotification(notif.id)}
                      className={`absolute top-3 right-3 p-1 rounded-md transition-colors
                        ${notif.type === 'info' ? 'hover:bg-gray-100 text-gray-400' : ''}
                        ${notif.type === 'warning' ? 'hover:bg-amber-200 text-amber-700' : ''}
                        ${notif.type === 'urgent' ? 'hover:bg-red-200 text-red-700' : ''}
                      `}
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              {activeTab === 'bible' && <DelegatesBible />}
              {activeTab === 'speech' && <SpeechBuilder />}
              {activeTab === 'research' && <GlobalResearchCenter />}
              {activeTab === 'tracker' && <PointTracker />}
              {activeTab === 'handbook' && <HandbookViewer />}
              {activeTab === 'agenda' && <AgendaViewer />}
              {activeTab === 'certificate' && <CertificateGenerator />}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
