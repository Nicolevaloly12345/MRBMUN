import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Award, User, Target, ChevronDown } from 'lucide-react';

export default function CertificateGenerator() {
  const [name, setName] = useState('');
  const [committee, setCommittee] = useState('DISEC');
  const [delegation, setDelegation] = useState('');
  const [awardType, setAwardType] = useState('Participación');
  
  const isAvailable = new Date() >= new Date('2026-06-04T05:00:00Z'); // 4 de junio (Bogotá time)

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const committees = [
    'CRISIS UNICAMERAL',
    'COMITÉ POLÍTICO-FILOSÓFICO VIP',
    'DISEC',
    'OMS',
    'FMI',
    'ONU MUJERES',
    'PRENSA'
  ];

  const awardTypes = [
    'Participación',
    'Mejor Delegado',
    'Delegado Sobresaliente',
    'Mención de Honor'
  ];

  useEffect(() => {
    drawCertificate();
  }, [name, committee, delegation, awardType, isAvailable]);

  const drawCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution for rendering
    canvas.width = 1123; // A4 landscape width at 96 DPI
    canvas.height = 794; // A4 landscape height at 96 DPI

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#800020'; // Burgundy
    ctx.lineWidth = 15;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.strokeStyle = '#FFD700'; // Gold
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

    // Organization Name
    ctx.fillStyle = '#800020';
    ctx.textAlign = 'center';
    ctx.font = 'bold 36px serif';
    ctx.fillText('COLEGIO MONTERROSALES BILINGÜE', canvas.width / 2, 120);
    
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 24px serif';
    ctx.fillText('MRBMUN 2026', canvas.width / 2, 160);

    // Certificate Type
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 48px serif';
    ctx.fillText(`Certificado de ${awardType}`, canvas.width / 2, 260);

    // "Se otorga a"
    ctx.fillStyle = '#4B5563';
    ctx.font = 'italic 24px serif';
    ctx.fillText('Se otorga el presente reconocimiento a:', canvas.width / 2, 330);

    // Name
    ctx.fillStyle = '#800020';
    ctx.font = 'bold 56px serif';
    ctx.fillText(name || '[Nombre del Delegado]', canvas.width / 2, 420);

    // Delegation & Committee
    ctx.fillStyle = '#4B5563';
    ctx.font = '24px sans-serif';
    if (delegation) {
      ctx.fillText(`En representación de ${delegation}`, canvas.width / 2, 490);
      ctx.fillText(`como delegado/a en el comité de`, canvas.width / 2, 530);
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 28px serif';
      ctx.fillText(committee, canvas.width / 2, 580);
    } else {
      ctx.fillText(`Por su participación en el comité de`, canvas.width / 2, 490);
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 28px serif';
      ctx.fillText(committee, canvas.width / 2, 540);
    }

    // Signatures
    ctx.fillStyle = '#111827';
    
    // Secretario General
    ctx.font = 'italic 32px serif';
    ctx.fillText('Miguel Elías Sudano', 250, 670);
    ctx.beginPath();
    ctx.moveTo(150, 680);
    ctx.lineTo(350, 680);
    ctx.stroke();
    ctx.font = '18px sans-serif';
    ctx.fillText('Secretario General', 250, 710);
    
    // Secretaría Académica
    ctx.font = 'italic 32px serif';
    ctx.fillText('María José Neira', canvas.width - 250, 670);
    ctx.beginPath();
    ctx.moveTo(canvas.width - 350, 680);
    ctx.lineTo(canvas.width - 150, 680);
    ctx.stroke();
    ctx.font = '18px sans-serif';
    ctx.fillText('Secretaría Académica', canvas.width - 250, 710);

    if (!isAvailable) {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 6);
      ctx.fillStyle = 'rgba(128, 0, 32, 0.15)'; // Burgundy with low opacity
      ctx.font = 'bold 120px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VISTA PREVIA', 0, 0);
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('Disponible para descarga el 4 de junio', 0, 80);
      ctx.restore();
    }
  };

  const handleDownload = () => {
    if (!isAvailable) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `Certificado_${name.replace(/\s+/g, '_') || 'Delegado'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-burgundy mb-2">Generador de Certificados</h2>
        <p className="text-gray-600">
          Crea certificados personalizados para tu participación en MRBMUN 2026.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                placeholder="Ej. Juan Pérez"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Representación (País/Personaje)
            </label>
            <div className="relative">
              <Target size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={delegation}
                onChange={(e) => setDelegation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                placeholder="Ej. Delegación de Francia"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comité
              </label>
              <div className="relative">
                <select
                  value={committee}
                  onChange={(e) => setCommittee(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold appearance-none transition-all"
                >
                  {committees.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Reconocimiento
              </label>
              <div className="relative">
                <select
                  value={awardType}
                  onChange={(e) => setAwardType(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold appearance-none transition-all"
                >
                  {awardTypes.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={!name || !isAvailable}
            className="w-full flex flex-col items-center justify-center gap-1 bg-burgundy hover:bg-burgundy/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors"
          >
            <div className="flex items-center gap-2">
              <Download size={20} />
              <span>Descargar Certificado</span>
            </div>
            {!isAvailable && (
              <span className="text-xs text-white/70 font-normal">Disponible a partir del 4 de junio</span>
            )}
          </button>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col items-center">
          <p className="text-sm font-medium text-gray-500 mb-4 tracking-wider uppercase">
            Vista Previa
          </p>
          <div className="w-full overflow-hidden rounded-lg shadow-lg bg-white relative select-none" style={{ aspectRatio: '1123/794' }}>
            <canvas
              ref={canvasRef}
              className={`w-full h-full object-contain ${!isAvailable ? 'pointer-events-none' : ''}`}
              onContextMenu={(e) => {
                if (!isAvailable) e.preventDefault();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
