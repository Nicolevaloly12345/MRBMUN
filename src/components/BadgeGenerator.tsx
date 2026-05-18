import React, { useState, useRef, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Download, Fingerprint, Globe } from 'lucide-react';
import html2canvas from 'html2canvas';

export function BadgeGenerator() {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('Colombia');
  const [committee, setCommittee] = useState('ONU Mujeres');
  const badgeRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Valores de movimiento para el efecto 3D
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleDownload = async () => {
    if (!badgeRef.current) return;
    setIsDownloading(true);
    
    try {
      // Create a temporary clone for downloading to avoid 3D transform issues
      const clone = badgeRef.current.cloneNode(true) as HTMLElement;
      
      // We need to append the clone temporarily to the body to ensure it renders correctly
      // We'll hide it off-screen and remove 3D transforms
      Object.assign(clone.style, {
        position: 'absolute',
        top: '-9999px',
        left: '-9999px',
        transform: 'none',
        perspective: 'none',
        rotateX: 'none',
        rotateY: 'none'
      });
      
      // Remove any Z-translations from inner elements to ensure flat rendering
      const zTranslatedElements = clone.querySelectorAll('[style*="translateZ"]');
      zTranslatedElements.forEach(el => {
        (el as HTMLElement).style.transform = 'none';
      });

      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      
      document.body.removeChild(clone);
      
      const link = document.createElement('a');
      link.download = `Credencial_${name || 'Delegado'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error al descargar la credencial:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-burgundy/5 to-snow rounded-[2rem] p-8 md:p-12 shadow-xl border border-burgundy/10 w-full relative overflow-hidden">
      
      <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Formulario */}
        <div className="space-y-6">
          <div>
             <h3 className="text-3xl font-serif font-bold text-burgundy mb-2">Generador de Credenciales</h3>
             <p className="text-gray-600">Personaliza tu gafete oficial de MRBMUN 2026 y descárgalo o mira cómo cobra vida en 3D.</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delegado</label>
              <input
                type="text"
                maxLength={25}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-burgundy/50 transition-all focus:outline-none"
                placeholder="Nombre y Apellido"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delegación (País)</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-burgundy/50 transition-all focus:outline-none bg-white"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="Colombia">Colombia</option>
                <option value="Estados Unidos">Estados Unidos</option>
                <option value="Francia">Francia</option>
                <option value="Reino Unido">Reino Unido</option>
                <option value="Rusia">Rusia</option>
                <option value="China">China</option>
                <option value="Suiza">Suiza</option>
                <option value="Brasil">Brasil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comité</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-burgundy/50 transition-all focus:outline-none bg-white"
                value={committee}
                onChange={(e) => setCommittee(e.target.value)}
              >
                <option value="ONU Mujeres">ONU Mujeres</option>
                <option value="FMI">FMI</option>
                <option value="OMS">OMS</option>
                <option value="Crisis Unicameral">Crisis Unicameral</option>
                <option value="Comité Político-Filosófico">Comité Político-Filosófico</option>
                <option value="DISEC">DISEC</option>
                <option value="Prensa">Prensa</option>
              </select>
            </div>
            <div className="pt-4">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full bg-burgundy hover:bg-burgundy/90 text-white font-medium py-3 px-6 rounded-xl transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <span className="flex items-center gap-2">
                     <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                     Generando...
                  </span>
                ) : (
                  <>
                     <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
                     Descargar Credencial
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tarjeta 3D */}
        <div className="flex justify-center items-center perspective-[1000px]">
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-[280px] h-[420px] rounded-2xl relative shadow-2xl cursor-pointer group"
          >
            <div ref={badgeRef} className="w-full h-full relative" style={{ transformStyle: "preserve-3d" }}>
               {/* Textura holográfica (Brillo) - Not captured in clone due to opacity-0 inline */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay z-20 overflow-hidden" 
                   style={{ transform: "translateZ(1px)" }}></div>
              
              {/* Lanyard / Cinta superior */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-16 pointer-events-none flex justify-center z-0">
                 <div className="w-16 h-20 bg-burgundy/90 absolute -top-8 clip-path-polygon-[0_0,100%_0,80%_100%,20%_100%]"></div>
                 <div className="w-8 h-4 rounded-full bg-gray-300 absolute top-2 z-10 shadow-inner"></div>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="absolute inset-0 bg-white rounded-2xl border flex flex-col items-center pt-10 pb-6 px-4 preserve-3d shadow-[0_0_20px_rgba(0,0,0,0.1)] border-t-8 border-t-burgundy">
                 <div style={{ transform: "translateZ(40px)" }} className="mb-4">
                    <img src="/logocolegio.png" alt="Logo" className="w-16 h-auto drop-shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                 </div>
                 
                 <h4 style={{ transform: "translateZ(50px)" }} className="text-xl font-serif font-bold text-burgundy text-center uppercase tracking-widest leading-tight mb-2">
                   MRBMUN<br/>2026
                 </h4>

                 <div style={{ transform: "translateZ(30px)" }} className="w-full bg-burgundy text-white text-center py-2 text-xs font-bold uppercase tracking-wider mb-6 shadow-md shadow-burgundy/20">
                    Delegado Oficial
                 </div>

                 <div style={{ transform: "translateZ(60px)" }} className="flex-1 flex flex-col items-center justify-center w-full px-2 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1 leading-tight w-full break-words">
                      {name || 'Tu Nombre'}
                    </h2>
                    <p className="text-gray-500 font-medium text-sm mb-4 uppercase tracking-wide flex items-center gap-1">
                      <Globe size={14} /> {country}
                    </p>
                    
                    <div className="w-full bg-snow rounded-xl p-3 border border-gray-100 flex flex-col items-center">
                       <p className="text-xs text-gray-400 font-medium uppercase mb-1">Comité</p>
                       <p className="text-sm font-bold text-burgundy leading-tight h-10 flex items-center text-center justify-center">{committee}</p>
                    </div>
                 </div>

                 {/* Footer de la tarjeta con código de barras o huella */}
                 <div style={{ transform: "translateZ(20px)" }} className="mt-auto pt-4 border-t w-full flex justify-between items-center text-gray-300">
                    <Fingerprint size={28} />
                    <div className="flex gap-1 items-center">
                       <div className="w-1 h-6 bg-gray-300"></div>
                       <div className="w-2 h-6 bg-gray-300"></div>
                       <div className="w-1 h-6 bg-gray-300"></div>
                       <div className="w-3 h-6 bg-gray-300"></div>
                       <div className="w-1 h-6 bg-gray-300"></div>
                       <div className="w-2 h-6 bg-gray-300"></div>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
