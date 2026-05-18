import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Save, AlertCircle } from 'lucide-react';

export default function GlobalResearchCenter() {
  const [researchData, setResearchData] = useLocalStorage('mun-research-db', {
    foreignPolicy: '',
    economicAlliances: '',
    recentConflicts: '',
    countryDetails: ''
  });

  const [savedStatus, setSavedStatus] = React.useState(false);

  const handleSave = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#E5E7EB]">
        <div>
          <h2 className="text-2xl font-serif font-bold text-burgundy">Base de Datos Global</h2>
          <p className="text-sm text-gray-500 mt-1">Tu repositorio fuera de línea para la preparación del comité.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-burgundy text-snow rounded-lg font-medium hover:bg-burgundy/90 transition-colors shadow-sm"
        >
          {savedStatus ? '¡Guardado!' : 'Guardar Datos'}
          <Save size={18} />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#E5E7EB] overflow-hidden">
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          <div className="p-6 md:p-8 space-y-4">
            <div className="flex items-start justify-between">
              <label className="text-sm font-bold tracking-wide text-burgundy uppercase">Política Exterior</label>
            </div>
            <textarea 
              value={researchData.foreignPolicy}
              onChange={(e) => setResearchData({...researchData, foreignPolicy: e.target.value})}
              placeholder="¿Cuál es la postura principal de su país sobre el tema de la agenda?"
              className="w-full text-sm leading-relaxed p-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gold outline-none transition-all h-32 resize-none"
            />

            <div className="flex items-start justify-between pt-4">
              <label className="text-sm font-bold tracking-wide text-burgundy uppercase">Alianzas Económicas</label>
            </div>
            <textarea 
              value={researchData.economicAlliances}
              onChange={(e) => setResearchData({...researchData, economicAlliances: e.target.value})}
              placeholder="Enumere bloques comerciales, principales socios y alianzas (ej. UE, OTAN)."
              className="w-full text-sm leading-relaxed p-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gold outline-none transition-all h-32 resize-none"
            />
          </div>

          <div className="p-6 md:p-8 space-y-4 bg-gray-50/50">
            <div className="flex items-start justify-between">
              <label className="text-sm font-bold tracking-wide text-burgundy uppercase">Conflictos Recientes</label>
              <AlertCircle size={16} className="text-red-400" />
            </div>
            <textarea 
              value={researchData.recentConflicts}
              onChange={(e) => setResearchData({...researchData, recentConflicts: e.target.value})}
              placeholder="¿Qué debilidades podrían atacar otros delegados? Incluya conflictos, crisis recientes."
              className="w-full text-sm leading-relaxed p-4 rounded-xl bg-white border border-gray-200 focus:border-red-300 focus:ring-1 focus:ring-red-300 outline-none transition-all h-40 resize-none"
            />

            <div className="flex items-start justify-between pt-4">
              <label className="text-sm font-bold tracking-wide text-burgundy uppercase">Métricas y Estadísticas Clave</label>
            </div>
            <textarea 
              value={researchData.countryDetails}
              onChange={(e) => setResearchData({...researchData, countryDetails: e.target.value})}
              placeholder="PIB, PIB per cápita, Población, Presupuesto Militar, historial de votación..."
              className="w-full text-sm leading-relaxed p-4 rounded-xl bg-white border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all h-32 resize-none"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
