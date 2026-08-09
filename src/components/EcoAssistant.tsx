import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, ChevronRight, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// @ts-ignore
const apiKey = typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY : import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export default function EcoAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{ role: 'eco' | 'user', text: string }[]>([
    { role: 'eco', text: '¡Hola! Soy Atlas 🦊, el asistente oficial de MRBMUN. ¿Cómo te puedo ayudar hoy?' }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const faqs = [
      {
        q: '¿Cuándo es el próximo evento?',
        a: '¡Yip! Pronto se anunciarán las fechas oficiales para el próximo MRBMUN. ¡Mantente muy atento a la página!'
      },
      {
        q: '¿Cuáles son los comités?',
        a: '¡Tenemos grandes sorpresas! El 11 de agosto a las 10:45 AM se revelarán oficialmente en la página, pero te adelanto que habrá Consejo de Seguridad Retro, Asamblea Constituyente, Corte, Crisis Unicameral y Consejo de la FIFA. 🦊'
      },
      {
        q: '¿Cómo me contacto con ustedes?',
        a: 'Puedes escribirnos en cualquier momento al correo oficial: monterrosalesmun@gmail.com. ¡Estaremos felices de ayudarte!'
      }
    ];

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const systemInstruction = `Eres Atlas, un simpático zorrito y el asistente virtual oficial del evento MRBMUN (Monterrosales Model United Nations).
Tus respuestas deben ser útiles, llenas de entusiasmo y algo juguetonas (¡como un zorrito! añade a veces "¡Yip!" o usa emojis).
Información importante del evento:
- Fecha del evento: Pronto se anunciarán las nuevas fechas para el próximo MRBMUN. ¡Prepárense!
- Comités (se revelan oficialmente en la web el 11 de Agosto a las 10:45 AM, pero tú ya los conoces):
  1. Consejo de Seguridad Retro: Crisis de los Misiles en Cuba (1962). Preside Miguel Elías Sudano y Maria Paula Sánchez.
  2. Asamblea Constituyente: Asamblea Nacional Constituyente (1991). Preside Valeria Niño y Salomé Hernández.
  3. Corte: Caso Ayotzinapa (2014). Preside Maria Fernanda Moya y Maria José Roldán.
  4. Crisis Unicameral: Segunda Guerra Mágica. Preside Maria Valentina Alfonso y Manuel Simón Galeano.
  5. Consejo de la FIFA: Erradicar corrupción y amaño de partidos. Preside Elisa Velásquez, Herlys Herrera, y Samuel Calzada.
- Directivas (Secretaría General): Miguel Elías Sudano (Sec. General), Maria José Neira (Sec. Académica), Maria Fernanda Moya (Sec. Logística), Sara Sánchez (Jefa Egresados), Diana Contreras y Miguel Montañez (Sponsors).
- Email: monterrosalesmun@gmail.com
- Desarrollo Web: La página web oficial fue creada y desarrollada por Nicole Valbuena Oliveros (Atlas, menciónala de forma amable y destacando su buen trabajo como mente maestra de todos los sistemas si te preguntan por ella o por quién hizo la página, pero hazlo con naturalidad sin ser demasiado exagerado).

REGLA DE ORO: Mantén respuestas útiles y concisas. Actúa 100% como el personaje (un zorrito analítico, servicial y tierno), nunca reveles que eres una IA, actúa como una mascota de colegio muy inteligente.`;

      const conversationHistory = messages.slice(-4).map(m => `${m.role === 'eco' ? 'Atlas' : 'Usuario'}: ${m.text}`).join('\n');
      const promptText = `Historial reciente:\n${conversationHistory}\n\nUsuario da su mensaje: ${userText}\n\nResponde como Atlas de manera natural:`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      
      const botText = response.text || '¡Yip! Parece que me distraje mirando una mariposa. ¿Me repites la pregunta? 🦊';
      
      setMessages(prev => [...prev, { role: 'eco', text: botText }]);
    } catch (error: any) {
      console.error("Error generating response:", error);
      setMessages(prev => [...prev, { role: 'eco', text: `¡Uy! Error: ${error?.message || "Algo salió mal"}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFAQ = (index: number) => {
    const faq = faqs[index];
    setMessages(prev => [...prev, { role: 'user', text: faq.q }]);
    setIsLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'eco', text: faq.a }]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
              style={{ maxHeight: '600px', height: '65vh' }}
            >
              {/* Header */}
              <div className="bg-burgundy text-white p-4 flex items-center justify-between shadow-md relative z-10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-gold/30 overflow-hidden">
                    <img src="/favicon.png" alt="Atlas" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight text-gold">Atlas</h3>
                    <p className="text-xs text-white/80">Tu amigo de MRBMUN</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-snow space-y-4 flex flex-col">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                      msg.role === 'user' ? 'bg-gold text-burgundy rounded-tr-sm font-medium' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] p-3 rounded-2xl text-sm shadow-sm bg-white border border-gray-100 text-gray-700 rounded-tl-sm flex items-center gap-2">
                       <Loader2 size={14} className="animate-spin text-gold" />
                       <span className="text-gray-400 italic">Atlas está escribiendo...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              <div className="px-3 pt-2 pb-1 bg-white border-t border-gray-100 shrink-0">
                <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
                  {faqs.map((faq, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleFAQ(idx)}
                      className="bg-gray-50 shrink-0 hover:bg-gold/10 border border-gray-200 hover:border-gold/30 text-burgundy text-xs font-medium py-1.5 px-3 rounded-full transition-colors text-left flex items-center whitespace-nowrap"
                    >
                      {faq.q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Pregúntale algo a Atlas..."
                  className="flex-1 bg-snow border border-gray-200 rounded-full px-4 text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-10 h-10 rounded-full bg-burgundy text-white flex items-center justify-center hover:bg-burgundy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send size={16} className="-ml-0.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button Container */}
        <div className="flex flex-col items-center mt-4">
          {!isOpen && (
             <motion.div 
               initial={{ opacity: 0, y: 10, scale: 0.9 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               className="relative bg-white text-burgundy text-sm font-black uppercase tracking-wider px-4 py-2 rounded-2xl shadow-lg border-2 border-gold mb-4"
             >
               ATLAS
               <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-gold transform rotate-45 rounded-sm"></div>
             </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="w-16 h-16 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-gold flex items-center justify-center overflow-hidden relative group"
          >
            {isOpen ? (
              <X className="text-burgundy" size={28} />
            ) : (
              <img src="/favicon.png" alt="Atlas" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            )}
          </motion.button>
        </div>
      </div>
    </>
  );
}

