import React from 'react';
import { Book, PenTool, Globe, Award, X, LogOut, FileText, Calendar } from 'lucide-react';
import { ActiveTab } from '../pages/PortalPage';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  closeSidebar: () => void;
  onExitPortal?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, closeSidebar, onExitPortal }: SidebarProps) {
  const tabs = [
    { id: 'bible', label: "La Biblia del Delegado", icon: Book },
    { id: 'agenda', label: "Agenda", icon: Calendar },
    { id: 'speech', label: "Frases Poderosas", icon: PenTool },
    { id: 'research', label: "Centro de Investigación", icon: Globe },
    { id: 'tracker', label: "Toma tus apuntes", icon: Award },
    { id: 'handbook', label: "Handbook", icon: FileText },
    { id: 'certificate', label: "Certificados", icon: Award },
  ] as const;

  return (
    <aside className={`
      fixed top-0 h-[100dvh] left-0 z-50 w-[240px] bg-burgundy text-snow flex flex-col 
      border-r-4 border-gold
      transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="p-6 pb-10 flex items-center justify-between">
        <div className="font-serif">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            MRB<span className="text-gold">MUN</span>
          </h1>
          <p className="text-xs text-snow/60 tracking-wider">EXCELENCIA ACADÉMICA 2026</p>
        </div>
        <button className="md:hidden p-1 hover:bg-white/10 rounded-md" onClick={closeSidebar}>
          <X size={20} className="text-snow/80" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-xs font-semibold text-snow/40 uppercase tracking-wider">
          Módulos
        </div>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                closeSidebar();
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-md transition-all duration-200 text-left
                ${isActive 
                  ? 'bg-gold/15 text-gold font-medium border-l-4 border-gold' 
                  : 'text-snow/70 hover:bg-white/5 hover:text-snow font-medium'}
              `}
            >
              <Icon size={18} className={isActive ? "text-gold" : "opacity-70"} />
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-white/10 flex flex-col gap-4">
        {onExitPortal && (
          <button 
            onClick={onExitPortal}
            className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-md text-sm transition-colors border border-white/10"
          >
            <LogOut size={16} /> Volver al Inicio
          </button>
        )}
        <div className="bg-white/5 rounded-lg p-4 border border-white/5">
          <p className="text-xs text-snow/60 text-center mb-2 font-medium">Sesión Activa</p>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-gold w-1/3 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    </aside>
  );
}
