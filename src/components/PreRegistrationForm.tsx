import React, { useState } from 'react';
import { addPreRegistration } from '../lib/firebase';
import { Loader2, CheckCircle, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

export function PreRegistrationForm() {
  const [formData, setFormData] = useState({ name: '', email: '', committee_interest: 'Sin decidir' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setStatus('submitting');
    try {
      await addPreRegistration(formData);
      setStatus('success');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#800020', '#FFD700', '#ffffff']
      });
    } catch (error) {
      console.error(error);
      setStatus('idle');
      alert("Hubo un error al guardar tu pre-inscripción.");
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gold/20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-2xl font-serif font-bold text-burgundy mb-2">¡Pre-inscripción Exitosa!</h3>
        <p className="text-gray-600">Nos pondremos en contacto contigo pronto con más detalles sobre MRBMUN 2026.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
      <h3 className="text-2xl font-serif font-bold text-burgundy mb-6">Formulario de Pre-Inscripción</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <input
            id="name"
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-burgundy/50 focus:border-burgundy/50 transition-all font-sans"
            placeholder="Ej. Nicole Valbuena"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
          <input
            id="email"
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-burgundy/50 focus:border-burgundy/50 transition-all font-sans"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="committee" className="block text-sm font-medium text-gray-700 mb-1">Comité de Interés</label>
          <select
            id="committee"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-burgundy/50 focus:border-burgundy/50 transition-all font-sans bg-white"
            value={formData.committee_interest}
            onChange={(e) => setFormData({ ...formData, committee_interest: e.target.value })}
          >
            <option value="Sin decidir">Aún no sé / Sin decidir</option>
            <option value="CS">Consejo de Seguridad (CS)</option>
            <option value="FMI">Fondo Monetario Internacional (FMI)</option>
            <option value="OMS">Organización Mundial de la Salud (OMS)</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-burgundy text-white px-6 py-4 rounded-xl font-medium hover:bg-burgundy/90 transition-all shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
        >
          {status === 'submitting' ? (
            <><Loader2 className="animate-spin" size={20} /> Guardando...</>
          ) : (
            <><Send size={20} /> Pre-inscribirme Ahora</>
          )}
        </button>
      </form>
    </div>
  );
}
