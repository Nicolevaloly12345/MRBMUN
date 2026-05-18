import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, SkipForward, SkipBack, Volume2, X } from 'lucide-react';

export const PageReader: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(-1);
  const [showControls, setShowControls] = useState(false);
  const [elements, setElements] = useState<HTMLElement[]>([]);
  
  const textElementsRef = useRef<HTMLElement[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  // Usamos una ref para el estado isPlaying porque el callback onend de utterance a veces usa un closure antiguo.
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    isPausedRef.current = isPaused;
  }, [isPlaying, isPaused]);

  useEffect(() => {
    // Recolectar elementos con texto leíble
    const collectElements = () => {
      const allTextElements = document.querySelectorAll('h1, h2, h3, h4, p, li, span.read-aloud');
      const els = Array.from(allTextElements)
        .filter(el => {
          // Excluir elementos ocultos o partes de la UI del lector/traductor
          if (el.closest('#google_translate_element')) return false;
          if (el.closest('#page-reader-controls')) return false;
          if (el.closest('.no-read')) return false; // si queremos excluir algunos
          
          const htmlEl = el as HTMLElement;
          // Comprobación más sencilla de visibilidad
          return htmlEl.offsetHeight > 0 && el.textContent && el.textContent.trim().length > 0;
        }) as HTMLElement[];
      console.log("Se encontraron " + els.length + " elementos para leer de " + allTextElements.length);
      setElements(els);
      textElementsRef.current = els;
    };

    collectElements();
    
    // Si la página muta mucho, podríamos usar un MutationObserver,
    // pero para esta landing estática estará bien así.
    setTimeout(collectElements, 1000); // recoger de nuevo tras la carga
    setTimeout(collectElements, 3000); 
  }, []);

  const getTargetLanguage = () => {
    // Google Translate a veces cambia el atributo lang del html. 
    // Si no, asumimos español.
    const htmlLang = document.documentElement.lang;
    return htmlLang || 'es';
  };

  const speak = (index: number, forceCancel: boolean = false) => {
    if (index < 0 || index >= textElementsRef.current.length) {
      stop();
      return;
    }

    const synth = window.speechSynthesis;
    if (forceCancel) {
      synth.cancel();
    }

    const element = textElementsRef.current[index];
    // Usamos innerText preferiblemente, y reemplazamos nuevas líneas con puntos para obligar a pausas.
    let text = (element.innerText || element.textContent || '').trim();
    // Limpiar saltos de línea internos y reemplazarlos por una pausa (punto) si no la hay
    text = text.replace(/[\r\n]+/g, '. ');
    
    if (!text || text === '.') {
        // Skip empty paragraph immediately (no speech synth needed)
        setCurrentTextIndex(prev => prev + 1);
        setTimeout(() => speak(index + 1, false), 10);
        return;
    }

    // Asegurarse de que haya una pausa natural al final si no hay puntuación
    const textToSpeak = text.match(/[.,!?:]\s*$/) ? text : text + '.';

    console.log(`Párrafo ${index}: leyendo "${textToSpeak.substring(0, 50)}..."`);
    
    // Resaltar elemento actual (suave)
    textElementsRef.current.forEach((el, i) => {
      if (i === index) {
        el.style.backgroundColor = 'rgba(128, 0, 32, 0.1)'; // burgundy muy claro
        el.style.borderRadius = '4px';
        el.style.transition = 'background-color 0.3s';
        // Scroll suave hacia el elemento para que el usuario sepa qué se está leyendo
        try {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (e) {}
      } else {
        el.style.backgroundColor = '';
      }
    });

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;
    // Guardar referencia global en window para evitar Garbage Collection bug de Chrome
    (window as any)._currentUtterance = utterance;
    
    // Configurar voz más natural y amigable
    utterance.pitch = 1.0; // Tono normal natural
    utterance.rate = 0.95; // Un poco más calmado
    utterance.volume = 1;
    
    const lang = getTargetLanguage(); // e.g. 'en', 'es', 'fr', 'pt'
    
    // Si Google Translate cambió el idoma y nos da un prefijo, intentamos ser más genéricos
    const baseLang = lang.split('-')[0];
    
    if (baseLang === 'en') {
      utterance.lang = 'en-AU'; // El usuario prefirió inglés australiano
    } else if (baseLang === 'es') {
      utterance.lang = 'es-US';
    } else if (baseLang === 'fr') {
      utterance.lang = 'fr-FR';
    } else if (baseLang === 'de') {
      utterance.lang = 'de-DE';
    } else {
      utterance.lang = lang; // Usar el raw lang detectado, e.g. 'it', 'pt', etc.
    }

    // Intentar buscar la mejor Voz
    let voices = synth.getVoices();
    let preferredVoice;
    
    if (baseLang === 'en') {
      // Priorizar voces de Australia recomendadas
      preferredVoice = voices.find(v => v.lang === 'en-AU' && (v.name.includes('Natasha') || v.name.includes('Karen') || v.name.includes('Online') || v.name.includes('Natural')));
      if (!preferredVoice) {
         preferredVoice = voices.find(v => v.lang === 'en-AU');
      }
    } else if (baseLang === 'es') {
      // Para español buscar voces más naturales que no suenen tan robóticas (Online > Natural > Nombres bonitos)
      const friendlyNames = ['Online', 'Natural', 'Microsoft Monica Online', 'Microsoft Sabina Online', 'Microsoft Elena Online', 'Google', 'Paulina', 'Isabella'];
      preferredVoice = voices.find(v => v.lang.startsWith('es') && friendlyNames.some(name => v.name.includes(name)));
      
      if (!preferredVoice) {
         preferredVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Female') || v.name.includes('Mujer') || !v.name.includes('Male')));
      }
    }
    
    // Si no tenemos una voz asignada todavía
    if (!preferredVoice) {
      preferredVoice = voices.find(v => 
        v.lang.startsWith(baseLang) && 
        (v.name.includes('Female') || v.name.includes('Mujer') || v.name.includes('Natural') || v.name.includes('Online'))
      );
    }
    
    // Fallback absoluto al idioma
    if (!preferredVoice) {
       preferredVoice = voices.find(v => v.lang.startsWith(baseLang));
    }
    
    if (preferredVoice) {
      console.log("Voz seleccionada:", preferredVoice.name, preferredVoice.lang);
      utterance.voice = preferredVoice;
    } else {
      console.log("No se encontró una voz para el idioma:", utterance.lang);
    }

    utterance.onend = () => {
      // Remover highlight
      element.style.backgroundColor = '';
      utteranceRef.current = null;
      
      if (isPlayingRef.current && !isPausedRef.current) {
        // Al terminar, ir a la siguiente parte con una mini pausa
        setCurrentTextIndex(prev => prev + 1);
        setTimeout(() => {
          if (isPlayingRef.current && !isPausedRef.current) {
             speak(index + 1, false);
          }
        }, 400); // 400ms pause makes it pleasant between sentences
      }
    };
    
    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      element.style.backgroundColor = '';
      utteranceRef.current = null;
      
      // Auto-recover and skip to next
      if (isPlayingRef.current && !isPausedRef.current) {
        setCurrentTextIndex(prev => prev + 1);
        setTimeout(() => {
          if (isPlayingRef.current && !isPausedRef.current) {
             speak(index + 1, false);
          }
        }, 400);
      }
    };

    try {
      synth.speak(utterance);
    } catch (err) {
      console.error('Error al intentar hablar:', err);
    }
  };

  useEffect(() => {
     // Forzar carga de voces en algunos navegadores
     window.speechSynthesis.onvoiceschanged = () => {
       window.speechSynthesis.getVoices();
     };
  }, []);

  const play = () => {
    if (textElementsRef.current.length === 0) {
      console.warn("No hay texto para leer en la pantalla.");
      alert("No se encontró texto para leer en la pantalla.");
      return;
    }
    
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      const startIndex = currentTextIndex >= 0 ? currentTextIndex : 0;
      setCurrentTextIndex(startIndex);
      setIsPlaying(true);
      setIsPaused(false);
      
      speak(startIndex, true);
    }
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTextIndex(-1);
    
    textElementsRef.current.forEach(el => {
      el.style.backgroundColor = '';
    });
  };

  const next = () => {
    const nextIdx = currentTextIndex + 1;
    if (nextIdx < textElementsRef.current.length) {
      setCurrentTextIndex(nextIdx);
      speak(nextIdx, true);
    }
  };

  const prev = () => {
    const prevIdx = currentTextIndex - 1;
    if (prevIdx >= 0) {
      setCurrentTextIndex(prevIdx);
      speak(prevIdx, true);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!('speechSynthesis' in window)) {
    return null;
  }

  if (!showControls) {
    return (
      <button 
        onClick={() => setShowControls(true)}
        className="fixed bottom-6 left-6 z-50 bg-burgundy text-white p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-burgundy/30 hover:bg-opacity-90 transition-all hover:-translate-y-1 flex items-center justify-center group"
        title="Escuchar página"
      >
        <Volume2 size={24} />
        <span className="hidden md:inline max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap pl-0 group-hover:pl-2 font-bold text-sm">
          Escuchar página
        </span>
      </button>
    );
  }

  return (
    <div 
      id="page-reader-controls"
      className="fixed bottom-6 left-6 z-50 bg-white border border-gray-100 p-2 rounded-[2rem] shadow-2xl flex items-center gap-1 md:gap-2 animate-in slide-in-from-bottom-5"
    >
      <button 
        onClick={prev} 
        disabled={currentTextIndex <= 0}
        className="p-3 text-gray-500 hover:text-burgundy hover:bg-snow rounded-full disabled:opacity-30 transition-colors"
        title="Párrafo anterior"
      >
        <SkipBack size={20} />
      </button>
      
      {!isPlaying || isPaused ? (
        <button 
          onClick={play} 
          className="p-4 bg-burgundy text-white rounded-full hover:bg-opacity-90 hover:scale-105 transition-all shadow-lg"
          title="Reproducir"
        >
          <Play size={20} className="ml-1" />
        </button>
      ) : (
        <button 
          onClick={pause} 
          className="p-4 bg-burgundy text-white rounded-full hover:bg-opacity-90 hover:scale-105 transition-all shadow-lg"
          title="Pausar"
        >
          <Pause size={20} />
        </button>
      )}
      
      <button 
        onClick={stop} 
        disabled={!isPlaying && !isPaused && currentTextIndex === -1}
        className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full disabled:opacity-30 transition-colors"
        title="Detener"
      >
        <Square size={20} />
      </button>

      <button 
        onClick={next} 
        disabled={currentTextIndex >= textElementsRef.current.length - 1}
        className="p-3 text-gray-500 hover:text-burgundy hover:bg-snow rounded-full disabled:opacity-30 transition-colors"
        title="Siguiente párrafo"
      >
        <SkipForward size={20} />
      </button>

      <div className="w-px h-10 bg-gray-200 mx-2"></div>

      <button 
        onClick={() => {
          stop();
          setShowControls(false);
        }}
        className="p-3 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
        title="Cerrar lector"
      >
        <X size={20} />
      </button>
    </div>
  );
};
