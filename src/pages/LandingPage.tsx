import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Users, Shield, BookOpen, ChevronRight, Menu, X, Mail, MapPin, Instagram, Phone, Calendar, Clock, CheckCircle, Swords, Landmark, Network, Youtube, Scale } from 'lucide-react';
import EcoAssistant from '../components/EcoAssistant';
import { PdfViewer } from '../components/PdfViewer';
import { GoogleTranslate } from '../components/GoogleTranslate';
import { PageReader } from '../components/PageReader';
import confetti from 'canvas-confetti';
import { CommitteeQuiz } from '../components/CommitteeQuiz';
import { PreRegistrationForm } from '../components/PreRegistrationForm';
import { BadgeGenerator } from '../components/BadgeGenerator';
import InteractiveEmblem from '../components/InteractiveEmblem';

export default function LandingPage({ onEnterPortal, onAdminAccess }: { onEnterPortal: () => void, onAdminAccess?: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNicoleModal, setShowNicoleModal] = useState(false);
  const [selectedManual, setSelectedManual] = useState<string | null>(null);
  const [comitesTimeLeft, setComitesTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComitesTimeUp, setIsComitesTimeUp] = useState(false);

  useEffect(() => {
    // 11 de agosto 2026, 10:45 AM (Colombia time is UTC-5)
    const targetDate = new Date('2026-08-11T10:45:00-05:00').getTime();
    
    const initialDistance = targetDate - new Date().getTime();
    if (initialDistance <= 0) {
      setIsComitesTimeUp(true);
    }
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance <= 0) {
        clearInterval(interval);
        setComitesTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (!isComitesTimeUp) setIsComitesTimeUp(true);
        return;
      }
      
      setComitesTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isComitesTimeUp]);

  const triggerConfetti = (memberName: string) => {
    if (memberName.includes("Nicole")) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.8 },
        colors: ['#800020', '#FFD700', '#ffffff', '#b3002d']
      });
      
      setTimeout(() => {
        setShowNicoleModal(true);
      }, 800);
    }
  };

  // Smooth scroll
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-snow font-sans text-gray-900 scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('inicio')}>
             {/* Mascot image as logo */}
             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gold">
               <img src="/Foxfavicon.png" alt="MRBMUN Mascot" className="w-full h-full object-cover" onError={(e) => {
                 // Fallback if no image is uploaded
                 (e.target as HTMLImageElement).style.display = 'none';
                 (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-gold font-serif font-bold text-xl">M</span>';
               }} />
             </div>
             <span className="font-serif font-bold text-xl text-burgundy tracking-tight">MRB<span className="text-gold">MUN</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <button onClick={() => scrollTo('nosotros')} className="text-sm font-medium text-gray-600 hover:text-burgundy transition-colors">Nosotros</button>
            <button onClick={() => scrollTo('comites')} className="text-sm font-medium text-gray-600 hover:text-burgundy transition-colors">Comités</button>
            <button onClick={() => scrollTo('cronograma')} className="text-sm font-medium text-gray-600 hover:text-burgundy transition-colors">Cronograma</button>
            <button onClick={() => scrollTo('inscripciones')} className="text-sm font-medium text-gray-600 hover:text-burgundy transition-colors">El Evento</button>
            <button onClick={() => scrollTo('equipo')} className="text-sm font-medium text-gray-600 hover:text-burgundy transition-colors">Equipo</button>
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              <GoogleTranslate />
              <button onClick={onEnterPortal} className="bg-burgundy text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-burgundy/90 transition-all shadow-md shadow-burgundy/20 flex items-center gap-2">
                Herramientas <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-burgundy" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-100 shadow-lg p-6 flex flex-col gap-4"
            >
              <button onClick={() => scrollTo('nosotros')} className="text-left font-medium text-gray-700 py-2 border-b border-gray-50">Nosotros</button>
              <button onClick={() => scrollTo('comites')} className="text-left font-medium text-gray-700 py-2 border-b border-gray-50">Comités</button>
              <button onClick={() => scrollTo('cronograma')} className="text-left font-medium text-gray-700 py-2 border-b border-gray-50">Cronograma</button>
              <button onClick={() => scrollTo('inscripciones')} className="text-left font-medium text-gray-700 py-2 border-b border-gray-50">El Evento</button>
              <button onClick={() => scrollTo('equipo')} className="text-left font-medium text-gray-700 py-2 border-b border-gray-50">Equipo</button>
              <button onClick={() => scrollTo('contacto')} className="text-left font-medium text-gray-700 py-2 border-b border-gray-50">Contacto</button>
              <div className="py-2 border-b border-gray-50">
                <GoogleTranslate />
              </div>
              <button onClick={onEnterPortal} className="bg-burgundy text-white px-5 py-3 rounded-xl font-medium mt-2 flex items-center justify-center gap-2">
                Herramientas para Delegados <ChevronRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#fdfbf7] via-snow to-snow">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-burgundy/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-gold/20 text-burgundy text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
              Modelo de Naciones Unidas
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-burgundy leading-[1.1] mb-6">
              Liderazgo global. <br />
              <span className="text-gold italic">Impacto real.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
              Únete a la edición 2026 de MRBMUN. El evento clave para consolidar habilidades de debate, negociación y diplomacia global en un entorno académico de excelencia.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onEnterPortal}
                className="bg-burgundy text-white px-8 py-4 rounded-full font-medium hover:bg-burgundy/90 transition-all shadow-xl shadow-burgundy/20 hover:shadow-burgundy/30 hover:-translate-y-0.5 flex items-center gap-2"
              >
                Herramientas del Delegado <BookOpen size={18} />
              </button>
              <button 
                onClick={() => scrollTo('nosotros')}
                className="bg-white text-burgundy border border-gray-200 px-8 py-4 rounded-full font-medium hover:bg-gray-50 hover:border-gold/30 hover:text-gold transition-all shadow-sm hover:shadow-md"
              >
                Sobre Nosotros
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Decorative background shape */}
            <div className="absolute inset-0 bg-gold/10 rounded-3xl transform translate-x-4 translate-y-4 -z-10"></div>
            <div className="absolute inset-0 bg-burgundy/5 rounded-3xl transform -translate-x-4 -translate-y-4 -z-10"></div>
            
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative border-8 border-white group">
              <img 
                src="/Foto-Hero.jpg" 
                alt="MRBMUN Evento" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy/90 via-burgundy/40 to-transparent flex items-end p-8 opacity-90 group-hover:opacity-100 transition-opacity">
                <p className="text-white font-serif italic text-xl border-l-4 border-gold pl-4">"Expandir la presencia institucional y fortalecer el debate global."</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute left-0 top-0 w-1/3 h-full bg-snow rounded-r-[100px] -z-10 translate-x-[-10%]"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="w-20 h-1 bg-gradient-to-r from-burgundy to-gold mb-8 rounded-full"></div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-burgundy mb-8">Acerca del Modelo</h2>
              <p className="text-xl text-gray-800 leading-relaxed mb-6 font-serif italic">
                "Representamos la identidad institucional del evento y facilitamos la interacción con participantes, invitados y aliados."
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                El MUN del Colegio Monterrosales Bilingüe es más que una simulación; es una experiencia inmersiva diseñada para desarrollar el pensamiento crítico, la empatía y la resolución de conflictos. A través de este espacio, centralizamos la información oficial del evento y fortalecemos nuestra imagen institucional, asegurando un ambiente profesional y atractivo para todos los asistentes.
              </p>
            </div>
            <div className="relative flex justify-center items-center">
               {/* Decorative elements behind emblem */}
               <div className="absolute inset-0 bg-gold/5 rounded-full blur-3xl scale-150"></div>
               <div className="relative z-10 w-full flex justify-center">
                 <InteractiveEmblem />
               </div>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-8 text-left mt-20 relative">
             <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent -z-10 hidden sm:block"></div>
             
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 hover:-translate-y-1 hover:border-gold/30 transition-all group">
                <div className="w-12 h-12 bg-burgundy/5 rounded-2xl flex items-center justify-center mb-6 text-burgundy group-hover:bg-burgundy group-hover:text-white transition-colors">
                  <Globe size={24} />
                </div>
                <h4 className="font-serif font-bold text-xl text-burgundy mb-3">Misión</h4>
                <p className="text-gray-600 leading-relaxed">Fomentar el análisis geopolítico y social mediante debates rigurosos que preparen a los estudiantes para sus futuros roles profesionales.</p>
             </div>
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 hover:-translate-y-1 hover:border-gold/30 transition-all group">
                <div className="w-12 h-12 bg-burgundy/5 rounded-2xl flex items-center justify-center mb-6 text-burgundy group-hover:bg-burgundy group-hover:text-white transition-colors">
                  <Users size={24} />
                </div>
                <h4 className="font-serif font-bold text-xl text-burgundy mb-3">Visión</h4>
                <p className="text-gray-600 leading-relaxed">Ser reconocidos como el modelo de Naciones Unidas líder a nivel intercolegial, destacando por nuestra innovación, inclusión y calidad académica.</p>
             </div>
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 hover:-translate-y-1 hover:border-gold/30 transition-all group">
                <div className="w-12 h-12 bg-burgundy/5 rounded-2xl flex items-center justify-center mb-6 text-burgundy group-hover:bg-burgundy group-hover:text-white transition-colors">
                  <BookOpen size={24} />
                </div>
                <h4 className="font-serif font-bold text-xl text-burgundy mb-3">Historia</h4>
                <p className="text-gray-600 leading-relaxed">Desde nuestras primeras ediciones hemos construido una tradición de excelencia, creciendo cada año en la magnitud de nuestros comités y recursos.</p>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Committees Section */}
      <section id="comites" className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-burgundy mb-4">Comisiones y Tópicos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Conoce los escenarios donde se debatirán las crisis y resoluciones más apremiantes a nivel mundial.</p>
          </motion.div>

          {!isComitesTimeUp ? (
            <div className="bg-white rounded-3xl p-10 md:p-16 shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center max-w-4xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-[100px]"></div>
              <Clock className="text-gold w-20 h-20 mb-6 animate-pulse relative z-10" />
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-burgundy mb-4 relative z-10">Pronto aparecerán los comités elegidos</h3>
              <p className="text-xl text-gray-600 mb-10 relative z-10">Prepárense para conocer los escenarios oficiales.</p>
              
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 relative z-10">
                <div className="text-center">
                  <span className="block text-4xl md:text-6xl font-bold text-burgundy bg-gray-50 rounded-2xl p-4 min-w-[100px] shadow-sm border border-gray-100">{comitesTimeLeft.days}</span>
                  <span className="text-sm font-bold text-gray-500 uppercase mt-2 block tracking-wider">Días</span>
                </div>
                <div className="text-center">
                  <span className="block text-4xl md:text-6xl font-bold text-burgundy bg-gray-50 rounded-2xl p-4 min-w-[100px] shadow-sm border border-gray-100">{comitesTimeLeft.hours}</span>
                  <span className="text-sm font-bold text-gray-500 uppercase mt-2 block tracking-wider">Horas</span>
                </div>
                <div className="text-center">
                  <span className="block text-4xl md:text-6xl font-bold text-burgundy bg-gray-50 rounded-2xl p-4 min-w-[100px] shadow-sm border border-gray-100">{comitesTimeLeft.minutes}</span>
                  <span className="text-sm font-bold text-gray-500 uppercase mt-2 block tracking-wider">Min</span>
                </div>
                <div className="text-center">
                  <span className="block text-4xl md:text-6xl font-bold text-burgundy bg-gray-50 rounded-2xl p-4 min-w-[100px] shadow-sm border border-gray-100">{comitesTimeLeft.seconds}</span>
                  <span className="text-sm font-bold text-gray-500 uppercase mt-2 block tracking-wider">Seg</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: <Shield className="text-gold" size={32} />,
                  name: 'Consejo de Seguridad Retro',
                  level: 'Regular',
                  topics: ['Crisis de los Misiles en Cuba (1962)'],
                  board: 'Miguel Elías Sudano, Maria Paula Sánchez',
                  manual: null
                },
                {
                  icon: <Landmark className="text-gold" size={32} />,
                  name: 'Asamblea Constituyente',
                  level: 'Legislativa',
                  topics: ['Asamblea Nacional Constituyente (1991)'],
                  board: 'Valeria Niño, Salomé Hernández',
                  manual: null
                },
                {
                  icon: <Scale className="text-gold" size={32} />,
                  name: 'Corte',
                  level: 'Corte',
                  topics: ['Caso de los 43 estudiantes de Ayotzinapa en México (2014)'],
                  board: 'Maria Fernanda Moya, Maria José Roldán',
                  manual: null
                },
                {
                  icon: <Swords className="text-gold" size={32} />,
                  name: 'Crisis Unicameral',
                  level: 'Crisis',
                  topics: ['Segunda Guerra Mágica'],
                  board: 'Maria Valentina Alfonso, Manuel Simón Galeano. Staff: Nicole Valbuena, Amy Samhara Méndez, Elisa Velasquez',
                  manual: null
                }
              ].map((com, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/30 border border-gray-100 hover:border-gold/50 transition-all hover:-translate-y-2 group relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
                  <div className="mb-8 p-4 bg-snow inline-block rounded-2xl group-hover:bg-burgundy/5 transition-colors z-10 self-start">{com.icon}</div>
                  <h3 className="text-2xl font-serif font-bold text-burgundy mb-3 relative z-10">{com.name}</h3>
                  <div className="relative z-10 self-start">
                    <span className="inline-flex px-4 py-1.5 bg-burgundy/5 text-burgundy text-[10px] font-bold uppercase tracking-wider rounded-full mb-6 border border-burgundy/10">{com.level}</span>
                  </div>
                  
                  <div className="flex-1 relative z-10 mb-6">
                    <strong className="text-burgundy block mb-2">{com.topics.length > 1 ? 'Tópicos:' : 'Tópico:'}</strong>
                    <ul className="space-y-1">
                      {com.topics.map((t, i) => (
                        <li key={i} className="text-gray-600 text-sm leading-relaxed">{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-5 border-t border-gray-100 flex flex-col gap-4 relative z-10">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full border border-gray-200 flex items-center justify-center">
                         <Users size={16} className="text-gray-400" />
                       </div>
                       <div className="text-sm">
                         <p className="font-bold text-burgundy text-xs uppercase tracking-wider">Mesa Directiva</p>
                         <p className="text-gray-500 font-medium text-xs line-clamp-2 leading-snug">{com.board}</p>
                       </div>
                     </div>
                     
                     {com.manual ? (
                       <button 
                         onClick={() => setSelectedManual(com.manual!)}
                         className="mt-2 text-center text-sm font-bold text-white bg-burgundy py-2.5 px-4 rounded-xl hover:bg-burgundy/90 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                       >
                         <BookOpen size={16} /> Ver Manual
                       </button>
                     ) : (
                       <button 
                         disabled
                         className="mt-2 text-center text-sm font-bold text-gray-400 bg-gray-50 py-2.5 px-4 rounded-xl border border-gray-100 flex items-center justify-center gap-2 cursor-not-allowed"
                       >
                         <Clock size={16} /> Pronto aparecerán
                       </button>
                     )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Committee Quiz Section */}
      <section className="py-24 bg-snow relative z-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
            >
                 <span className="text-gold font-bold uppercase tracking-widest text-sm mb-4 block">Test Interactivo</span>
                 <h2 className="text-3xl md:text-5xl font-serif font-bold text-burgundy mb-6">¿No sabes qué comité elegir?</h2>
                 <p className="text-xl text-gray-600 mb-8 leading-relaxed">Descubre cuál es tu perfil ideal con este divertido quiz y únete a la comisión donde podrás brillar y tener un impacto real.</p>
                 <div className="hidden md:block w-32 h-1 bg-gradient-to-r from-burgundy to-gold rounded-full"></div>
            </motion.div>
            <motion.div
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
            >
               <CommitteeQuiz />
            </motion.div>
        </div>
      </section>

      {/* Schedule / Cronograma Section */}
      <section id="cronograma" className="py-24 bg-white relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-burgundy mb-4">Cronograma del Evento</h2>
            <p className="text-gray-600 text-lg">Conoce el itinerario oficial para aprovechar al máximo cada jornada de debate.</p>
          </div>
          <div className="relative bg-snow p-2 md:p-4 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center">
            <div className="w-full rounded-2xl overflow-hidden bg-white">
              <PdfViewer url="/MRBMUN HORARIOS.pdf" />
            </div>
          </div>
        </div>
      </section>

      {/* Event Countdown Section */}
      <section id="inscripciones" className="py-24 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-burgundy/10 via-snow to-snow border-y border-burgundy/10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold font-bold uppercase tracking-widest text-sm mb-4 block">Prepárate</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-burgundy mb-6">
              Próximo MUN en camino
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              Próximo MUN pronto vendrá. Alístense, pronto aparecerán las fechas oficiales del evento.
            </p>

            <div className="bg-gradient-to-r from-burgundy to-[#b3002d] rounded-2xl p-10 shadow-2xl border border-gold/50 mb-8 flex flex-col items-center justify-center transform hover:scale-105 transition-transform">
               <h3 className="text-4xl md:text-5xl font-black text-white italic tracking-wider uppercase drop-shadow-lg scale-110 mb-4 animate-pulse text-center">¡MUY PRONTO!</h3>
               <p className="text-gold font-bold text-xl font-serif text-center drop-shadow-md">NUEVAS EXPERIENCIAS</p>
               <div className="mt-6 flex justify-center space-x-2">
                 <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
                 <div className="w-2 h-2 rounded-full bg-white animate-ping" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-2 h-2 rounded-full bg-white animate-ping" style={{ animationDelay: '0.4s' }}></div>
               </div>
            </div>

          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl shadow-burgundy/5 border border-gray-100 relative overflow-hidden group flex flex-col items-center justify-center text-center"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full -z-0 group-hover:scale-110 transition-transform duration-500"></div>
             <Calendar className="text-gold mb-8 relative z-10" size={56} strokeWidth={1.5} />
             <h3 className="text-3xl font-serif font-bold text-burgundy mb-4 relative z-10">Fechas Oficiales</h3>
             <p className="text-gray-500 relative z-10 mb-8 text-lg">
               Las fechas del próximo evento serán anunciadas próximamente. ¡Mantente atento!
             </p>
             <div className="w-16 h-1 bg-gradient-to-r from-burgundy to-gold rounded-full relative z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* Badge Generator Section */}
      <section className="py-24 bg-white relative z-10 border-t border-gray-100 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <BadgeGenerator />
        </div>
      </section>

      {/* Team Section */}
      <section id="equipo" className="py-24 bg-gradient-to-br from-[#800020] via-[#5a0016] to-[#2a000a] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-[#b3002d]/40 rounded-full blur-[120px] -z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-gold/20 rounded-full blur-[120px] -z-0 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="text-gold font-bold uppercase tracking-widest text-sm mb-4 block">Nuestros Líderes</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Equipo Organizador</h2>
            <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">La dedicación y el esfuerzo detrás de la excelencia académica y logística de este prestigioso modelo.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-12 gap-y-16 max-w-5xl mx-auto">
            {[
              { role: 'Secretario General', name: 'Miguel Elías Sudano', img: '/FotoM.png', imgClass: 'object-[center_10%] hover:scale-110' },
              { role: 'Secretaria Académica', name: 'Maria José Neira', img: '/Foto10.JPG', imgClass: 'object-[center_15%] hover:scale-110' },
              { role: 'Secretaria de Logística', name: 'Maria Fernanda Moya', img: '/FotoMafe.png', imgClass: 'object-top hover:scale-105' },
              { role: 'Jefa de Egresados', name: 'Sara Sánchez', img: '/FotoS.png', imgClass: 'object-[center_10%] hover:scale-110' },
              { role: 'Sponsor Académico', name: 'Diana Contreras', img: '/Foto2.jpg', imgClass: 'object-center hover:scale-110' },
              { role: 'Sponsor Académico', name: 'Miguel Montañez', img: '/Foto5.jpg', imgClass: 'object-[center_20%] hover:scale-110' },
              { role: 'Desarrolladora de Software', name: 'Nicole Valbuena Oliveros', img: '/Fotome.png', imgClass: 'object-[center_20%] hover:scale-110' }
            ].map((member, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx} 
                className="text-center group w-[220px] cursor-pointer"
                onClick={() => triggerConfetti(member.name)}
              >
                <div className="w-40 h-40 mx-auto bg-white/5 backdrop-blur-md rounded-full mb-6 flex items-center justify-center border-4 border-white/10 shadow-2xl group-hover:border-gold transition-all overflow-hidden relative group-hover:-translate-y-2">
                  {member.img ? (
                    <img src={member.img} alt={member.name} className={`w-full h-full object-cover transition-transform duration-700 ${member.imgClass || 'hover:scale-110'} opacity-90 group-hover:opacity-100`} />
                  ) : (
                    <span className="text-4xl font-serif font-bold text-gold">{member.role.charAt(0)}</span>
                  )}
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{member.name}</h3>
                <p className="text-xs font-bold text-gold uppercase tracking-widest">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Highlight */}
      <section className="py-20 bg-burgundy/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex sm:flex-row flex-col items-end sm:items-center justify-between mb-10 gap-4">
             <h2 className="text-3xl font-serif font-bold text-burgundy">Galería y Momentos</h2>
             <button className="text-sm font-bold text-gold hover:text-burgundy transition-colors flex items-center gap-1">
               Ver más <ChevronRight size={16} />
             </button>
          </div>
          <div className="flex flex-col gap-4">
             {/* Foto Principal */}
             <div className="w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-sm">
               <img src="/Foto7.JPG" className="w-full h-full object-cover object-[center_30%] hover:scale-105 transition-transform duration-500" alt="Evento MRBMUN" />
             </div>
             
             {/* Grid secundario */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                 <img src="/Foto1.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Delegados MRBMUN" />
               </div>
               <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                 <img src="/Foto3.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Comité MRBMUN" />
               </div>
               <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                 <img src="/Foto4.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Debate MRBMUN" />
               </div>
               <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                 <img src="/Foto5.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Ponencia MRBMUN" />
               </div>
             </div>
             
             {/* Grid inferior ancho */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="aspect-[2/1] md:aspect-[3/1] bg-gray-200 rounded-2xl overflow-hidden">
                 <img src="/Foto6.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Mesa directiva MRBMUN" />
               </div>
               <div className="aspect-[2/1] md:aspect-[3/1] bg-gray-200 rounded-2xl overflow-hidden">
                 <img src="/Foto2.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Participantes MRBMUN" />
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Contact & Footer */}
      <footer id="contacto" className="bg-[#0A0004] text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5 relative">
            <h2 className="font-serif font-bold text-3xl mb-4 text-gold flex items-center gap-3">
              MRB<span className="text-white">MUN</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
              Consolidando nuestra identidad y facilitando el acceso a herramientas y documentos clave para todos nuestros delegados.
            </p>
            <div className="flex gap-4">
               <a href="https://instagram.com/mrbmun_" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-burgundy transition-colors"><Instagram size={20} /></a>
               <a href="mailto:monterrosalesmun@gmail.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-burgundy transition-colors"><Mail size={20} /></a>
               <a href="https://youtube.com/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-burgundy transition-colors"><Youtube size={20} /></a>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <h3 className="font-bold mb-6 uppercase tracking-wider text-sm text-gold">Navegación</h3>
            <ul className="space-y-4 text-gray-300">
              <li><button onClick={() => scrollTo('inicio')} className="hover:text-white transition-colors">Inicio</button></li>
              <li><button onClick={() => scrollTo('nosotros')} className="hover:text-white transition-colors">Sobre Nosotros</button></li>
              <li><button onClick={() => scrollTo('comites')} className="hover:text-white transition-colors">Comisiones</button></li>
              <li><button onClick={onEnterPortal} className="text-gold font-bold hover:text-white transition-colors">Herramientas Académicas</button></li>
            </ul>
          </div>
          
          <div className="md:col-span-4">
            <h3 className="font-bold mb-6 uppercase tracking-wider text-sm text-gold">Contacto Oficial</h3>
            <ul className="space-y-4 text-gray-300 mb-8">
              <li className="flex items-start gap-3">
                <Instagram size={20} className="text-gold shrink-0 mt-0.5" />
                <a href="https://instagram.com/mrbmun_" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">@mrbmun_<br/><span className="text-xs text-gray-500">Instagram</span></a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={20} className="text-gold shrink-0 mt-0.5" />
                <a href="mailto:monterrosalesmun@gmail.com" className="hover:text-white transition-colors">monterrosalesmun@gmail.com<br/><span className="text-xs text-gray-500">Correo Oficial</span></a>
              </li>
              <li className="flex items-start gap-3">
                <Youtube size={20} className="text-gold shrink-0 mt-0.5" />
                <a href="https://youtube.com/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Canal Youtube MRBMUN<br/><span className="text-xs text-gray-500">YouTube</span></a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-gold shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p>Miguel Elias: <span className="text-gray-300 whitespace-nowrap">+57 3018090568</span></p>
                  <p>María José: <span className="text-gray-300 whitespace-nowrap">+57 3222272445</span></p>
                  <p>Diana Contreras: <span className="text-gray-300 whitespace-nowrap">+57 3108722776</span></p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-gold shrink-0 mt-0.5" />
                <span>Colegio Monterrosales Bilingüe<br/><span className="text-xs text-gray-500">Sede Principal</span></span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; 2026 MRBMUN. Todos los derechos reservados.</p>
          <button onClick={() => onAdminAccess?.()} className="text-gold text-xs hover:text-white transition-colors cursor-pointer text-left" title="Abrir Panel de Administración">Desarrollador: Nicole Valbuena Oliveros</button>
          <div className="flex gap-4">
             <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
             <a href="#" className="hover:text-white transition-colors">Reglamento MUN</a>
          </div>
        </div>
      </footer>

      {/* Floating Eco Assistant */}
      <EcoAssistant />
      <PageReader />
      
      {/* Nicole Presentation Modal */}
      <AnimatePresence>
        {showNicoleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNicoleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative border-2 border-gold/20"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowNicoleModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                title="Cerrar"
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-burgundy mb-6 shadow-xl">
                  <img src="/Fotome.png" alt="Nicole Valbuena Oliveros" className="w-full h-full object-cover object-[center_20%]" />
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-burgundy mb-2">Nicole Valbuena Oliveros</h3>
                <p className="text-gold font-bold tracking-widest text-xs uppercase mb-6">Desarrolladora de Software</p>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  ¡Hola! Soy Nicole Valbuena Oliveros. Actualmente curso el grado octavo y soy una persona apasionada por la programación y los idiomas. Manejo el inglés en un nivel C1 y me encuentro aprendiendo francés y alemán.
                </p>
                
                <button 
                  onClick={() => setShowNicoleModal(false)}
                  className="bg-burgundy text-white px-8 py-3 rounded-full font-bold hover:bg-gold transition-colors duration-300"
                >
                  ¡Genial!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedManual && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedManual(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-snow shrink-0">
                <h3 className="font-serif font-bold text-lg text-burgundy flex items-center gap-2">
                  <BookOpen size={20} className="text-gold" />
                  Manual del Comité
                </h3>
                <button 
                  onClick={() => setSelectedManual(null)}
                  className="p-2 text-gray-400 hover:text-black bg-white rounded-full border border-gray-200 hover:border-gray-300 transition-all cursor-pointer"
                  title="Cerrar Documento"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-8 relative">
                {selectedManual.startsWith('http') ? (
                  <div className="relative w-full h-full">
                    <iframe 
                      src={selectedManual.replace('/view?usp=sharing', '/preview?rm=minimal')} 
                      className="w-full h-full border-0 rounded-lg"
                      allow="autoplay"
                    />
                    {/* Overlay to block the pop-out button on Google Drive */}
                    <div 
                      className="absolute top-0 right-0 w-24 h-14 z-10 bg-transparent"
                      onContextMenu={(e) => e.preventDefault()}
                      title="No disponible"
                    ></div>
                  </div>
                ) : (
                  <PdfViewer url={selectedManual} />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
