import React, { useState } from 'react';
import { Book, ChevronRight, Gavel, Users, Info, Award, Settings, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DelegatesBible() {
  const [activeTab, setActiveTab] = useState<'points' | 'motions' | 'committees'>('points');

  const points = [
    {
      title: 'Punto de privilegio personal',
      desc: 'Se utiliza para solicitar una acción de beneficio personal para el delegado.'
    },
    {
      title: 'Punto de orden',
      desc: 'Se utiliza para solicitarle a la mesa directiva orden en el comité en caso de que un delegado o la misma mesa realice una acción indebida o que no acate a los procedimientos del comité.'
    },
    {
      title: 'Punto de duda parlamentaria',
      desc: 'Se utiliza para preguntarle a la mesa directiva una cuestión de interés general acerca del comité.'
    },
    {
      title: 'Punto de información (crisis)',
      desc: 'Se utiliza exclusivamente en el comité de crisis para realizarle preguntas al cuerpo de Crisis Staff sobre la actualización realizada, este punto se otorga por parte de Crisis Staff, a menos que se realice por punto de privilegio personal para solicitar un último punto de información, los puntos de información contienen el permiso para preámbulo y subsecuente implícito, así que no debe pedirse.'
    },
    {
      title: 'Punto de información (parlamento británico)',
      desc: 'Se usa exclusivamente en parlamento británico después del primer minuto y antes del último de un establecimiento por parte de un debatiente para realizarle preguntas, el debatiente deberá aceptar o rechazar, si rechaza, deberán pasar 15 segundos para que se le pueda realizar otro punto de información.'
    }
  ];

  const motions = [
    {
      title: 'Moción para la apertura de la lista de oradores',
      desc: 'Se usa para aperturar la lista de oradores al inicio de la primera sesión de cada tópico, con esta, se procede a que los delegados levanten su placard para ser anotados en el orden que la mesa considere en la lista de oradores.'
    },
    {
      title: 'Moción para la extensión del tiempo de orador',
      desc: 'Se utiliza para extender el tiempo de orador (de 1 minuto inicialmente), a lo que el delegado establezca y la mesa considere.'
    },
    {
      title: 'Moción para la apertura de una sesión extraordinaria de preguntas',
      desc: 'Se utiliza para aperturar una serie de preguntas hacia un delegado que acaba de realizar un discurso.'
    },
    {
      title: 'Moción para la apertura de una discusión formal',
      desc: 'Se utiliza para realizar un debate cara a cara entre dos delegados (no se contemplan discusiones formales de tres o más), después de un discurso con una duración estándar de un minuto con posible extensión a minuto y medio, de quererse extender se deberá usar una moción para la extensión de la discusión formal.'
    },
    {
      title: 'Moción para la apertura de un caucus moderado',
      desc: 'Se utiliza para establecer por un tiempo limitado una modalidad en la que cada delegado (seleccionado por la mesa al levantar el placard después de la intervención anterior), de un discurso breve, al ser una moción procedimental esta debe ser secundada y votada, el delegado que realice esta moción debe dar el tiempo que desee que dure la moción y el motivo, al mismo tiempo podrá optar por ser el primero o el último en dar su discurso, en caso de que opte ser el primero, el delegado que secunda la moción será el segundo, en caso de elegir ser el último, el delegado que secunde la moción pasará a establecer de primero, los delegados pueden solicitar una extensión del tiempo del caucus moderado a través de una moción para la extensión del caucus moderado.'
    },
    {
      title: 'Moción para la apertura de un caucus simple',
      desc: 'Se utiliza para desactivar temporalmente el procedimiento estándar del comité y así facilitar que los delegados puedan redactar documentos oficiales sin tener que establecer, también podrán discutir agendas y utilizar un lenguaje relativamente informal mientras se mantenga de forma respetuosa, al ser una moción procedimental debe ser secundada y votada, el delegado que realice la moción deberá establecer el tiempo y motivo de la moción, los delegados podrán solicitar la extensión del caucus simple a través de una moción para la extensión del caucus simple.'
    },
    {
      title: 'Moción para la apertura de un round robin',
      desc: 'Se utiliza para que todos los delegados establezcan un pequeño discurso sobre la situación actual a tratar en orden de izquierda a derecha según como estén sentados, al ser una moción procedimental debe ser secundada y votada.'
    },
    {
      title: 'Moción para la apertura de una consulta de gabinete',
      desc: 'Se utiliza para que el delegado que establezca el discurso pueda cederle la palabra al delegado de su elección hasta que la mesa solicite que se le ceda la moderación, al ser una moción procedimental debe ser secundada y votada, el delegado que solicita la moción debe cederle la moderación al que la secundó.'
    },
    {
      title: 'Derecho a réplica',
      desc: 'El derecho a réplica se podrá utilizar sólo si la mesa directiva considera que una delegación ha sido ofendida explícitamente, el derecho a réplica no se utiliza comúnmente en la modalidad para agilizar el debate, en caso de que un delegado quiera usarlo, deberá enviar un papel protocolar.'
    },
    {
      title: 'Moción para la introducción de un material audiovisual',
      desc: 'Se utiliza en los comités regulares para proponer un proyecto a través de presentaciones en powerpoint, prezi, canva, etc.'
    },
    {
      title: 'Moción para la introducción de una hoja de trabajo',
      desc: 'Se utiliza por los delegados una vez el documento resolutivo para comités regulares (hoja de trabajo) está listo y corregido, al hacerse esta moción los submitientes presentan la hoja ante los demás delegados, se somete a votación y se aprueba por mayoría (o se rechaza)'
    },
    {
      title: 'Moción para la introducción de una enmienda',
      desc: 'Se utiliza para realizar una modificación a la hoja de trabajo y poner en votación la enmienda.'
    },
    {
      title: 'Moción para la división de la cuestión',
      desc: 'Se utiliza para aislar un punto de la hoja de trabajo, se debe poner a votación.'
    },
    {
      title: 'Moción para el cierre de sesión',
      desc: 'Se utiliza para cerrar sesión, al ser una moción procedimental debe ser secundada y votada, sin embargo la mesa directiva podrá cerrar la sesión por oficio de ser necesario.'
    },
    {
      title: 'Moción de precedencia',
      desc: 'Es la única moción que puede interrumpir otra moción, consiste en que un delegado establezca otra moción de mayor prioridad para el comité, la jerarquía se maneja de la siguiente manera: Punto de privilegio personal, Punto de orden, Punto de duda parlamentaria, Moción para el cierre de sesión, Moción para la extensión de una moción previamente establecida, Moción para la apertura de una sesión extraordinaria de preguntas, Moción para la apertura de una discusión formal, Moción para la introducción de un documento, Moción para la apertura de un caucus moderado, simple u otras mociones procedimentales, Demás mociones.'
    },
    {
      title: 'Moción para la introducción de un plan de acción',
      desc: 'Se utiliza exclusivamente en los comités de Crisis o en su defecto en las crisis de los comités regulares, se utiliza para que los firmantes de un plan de acción lo presenten ante el resto del comité para someterlo a votación y aprobarlo o rechazarlo.'
    },
    {
      title: 'Moción para la introducción de un comunicado oficial',
      desc: 'Se utiliza exclusivamente en los comités de Crisis o en su defecto en las crisis de los comités regulares, se utiliza para que los firmantes de un comunicado oficial lo presenten ante el resto del comité para someterlo a votación y aprobarlo o rechazarlo.'
    },
    {
      title: 'Moción para la introducción del plan de acción final',
      desc: 'Se utiliza por los delegados una vez hayan terminado la redacción del plan de acción final y haya sido aprobado por la mesa directiva, así se somete a votación y se aprueba o rechaza, esta moción se usa exclusivamente en los comités de crisis.'
    },
    {
      title: 'Moción para la introducción del manifiesto',
      desc: 'Se utiliza por los delegados en la modalidad Político-Filosófica para introducir sus manifiestos.'
    },
    {
      title: 'Moción para la apertura del tópico',
      desc: 'Se usa para seleccionar qué tópico abrir en un comité en el que existan varios.'
    }
  ];

  const committees = [
    {
      name: 'CRISIS UNICAMERAL',
      board: [
        { role: 'Presidente', name: 'Miguel Elías Sudano (Interno) 🇻🇪' },
        { role: 'Vicepresidente', name: 'Sofía Mariangely Gomez (Asismun) 🇻🇪' },
        { role: 'Moderador', name: 'Juan Fernando García (Interno) 🇨🇴' },
        { role: 'Crisis staff', name: 'José Miguel Becerra (Asismun) 🇻🇪' },
        { role: 'Crisis staff', name: 'Anneth Mariana Luna Sánchez (Interna) 🇨🇴' }
      ],
      topics: ['Tópico Único: Invasión mongola a Japón (1281)'],
      modality: 'Crisis'
    },
    {
      name: 'COMITÉ POLÍTICO-FILOSÓFICO VIP',
      board: [
        { role: 'Presidente', name: 'Valeria González (Interna) 🇨🇴' },
        { role: 'Vicepresidente', name: 'Sarah Figueira (Dwmun) 🇻🇪' }
      ],
      topics: ['Tópico único: ¿Bajo qué principios morales se debe guiar la política?'],
      modality: 'Político-filosófica'
    },
    {
      name: 'DISEC',
      board: [
        { role: 'President', name: 'Sara Sánchez (Internal) 🇨🇴' },
        { role: 'Vicepresident', name: 'Valentina Gutiérrez (Internal) 🇨🇴' }
      ],
      topics: [
        'Topic A: Regulating the use of AI-Enabled lethal autonomous weapons systems (LAWS).',
        'Topic B: Proliferation of weapons in the conflict between Iran, Israel, and the United States, and its impact on international security.'
      ],
      modality: 'Regular'
    },
    {
      name: 'OMS',
      board: [
        { role: 'Presidente', name: 'Luciana Patiño (Interna) 🇨🇴' },
        { role: 'Co presidente', name: 'Sofía Dávila (Asismun) 🇻🇪' },
        { role: 'Moderadora', name: 'María José Neira (Interna) 🇨🇴' }
      ],
      topics: [
        'Tópico A: Impacto económico y social de la obesidad en México.',
        'Tópico B: Salud mental en adolescentes en la era digital'
      ],
      modality: 'Regular'
    },
    {
      name: 'FMI',
      board: [
        { role: 'Presidente', name: 'María Fernanda Moya (Interna) 🇨🇴' },
        { role: 'Vicepresidente', name: 'Isabella Moniello (Asismun) 🇻🇪' }
      ],
      topics: [
        'Tópico A: Dependencia económica y soberanía estatal en un sistema globalizado',
        'Tópico B: El papel de los organismos internacionales en la estabilización económica de Estados en crisis política',
        'Tópico C: Financiamiento de políticas públicas orientadas a la reducción de la pobreza extrema'
      ],
      modality: 'Regular'
    },
    {
      name: 'ONU MUJERES',
      board: [
        { role: 'Presidente', name: 'Anarelys Sosa (Asismun) 🇻🇪' },
        { role: 'Vicepresidente', name: 'Maria Paula Sánchez (Interna) 🇨🇴' }
      ],
      topics: [
        'Tópico A: Deconstrucción de ideologías y roles de género misóginos en el internet.',
        'Tópico B: Matrimonios forzados como violencia de género'
      ],
      modality: 'Regular'
    }
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#E5E7EB] overflow-hidden">
        <div className="flex border-b border-gray-100 flex-wrap">
          <button 
            className={`flex-1 min-w-[120px] py-4 px-2 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'points' ? 'text-burgundy border-b-2 border-gold bg-gray-50' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('points')}
          >
            <Book size={16} /> Puntos
          </button>
          <button 
            className={`flex-1 min-w-[120px] py-4 px-2 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'motions' ? 'text-burgundy border-b-2 border-gold bg-gray-50' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('motions')}
          >
            <Gavel size={16} /> Mociones
          </button>
          <button 
            className={`flex-1 min-w-[120px] py-4 px-2 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'committees' ? 'text-burgundy border-b-2 border-gold bg-gray-50' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('committees')}
          >
            <Users size={16} /> Comités
          </button>
        </div>

        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            
            {/* POINTS TAB */}
            {activeTab === 'points' && (
              <motion.div 
                key="points"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="font-serif text-2xl font-bold text-burgundy mb-2">Puntos del Protocolo</h2>
                  <p className="text-sm text-gray-500">Guía de puntos válidos dentro del modelo</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {points.map((item, idx) => (
                    <div key={idx} className="p-5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gold/5 hover:border-gold/30 transition-all">
                      <h3 className="font-serif font-semibold text-burgundy flex items-center gap-2 mb-2 text-lg">
                        <BookOpen size={18} className="text-gold flex-shrink-0" /> {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* MOTIONS TAB */}
            {activeTab === 'motions' && (
              <motion.div 
                key="motions"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="font-serif text-2xl font-bold text-burgundy mb-2">Mociones Parlamentarias</h2>
                  <p className="text-sm text-gray-500">Listado completo de mociones aceptadas en el procedimiento</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {motions.map((item, idx) => (
                    <div key={idx} className="p-5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gold/5 hover:border-gold/30 transition-all">
                      <h3 className="font-serif font-semibold text-burgundy flex items-center gap-2 mb-2 text-lg">
                        <Gavel size={18} className="text-gold flex-shrink-0" /> {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* COMMITTEES TAB */}
            {activeTab === 'committees' && (
              <motion.div 
                key="committees"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <div className="text-center mb-10">
                  <h2 className="font-serif text-2xl font-bold text-burgundy mb-2">Comités y Mesas Directivas</h2>
                  <p className="text-sm text-gray-500 max-w-2xl mx-auto">Conoce los comités, sus autoridades y los tópicos a tratar.</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {committees.map((com, cIdx) => (
                    <div key={cIdx} className="bg-white border text-left border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                      <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex-shrink-0">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-serif text-lg font-bold text-burgundy">{com.name}</h3>
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-gold/10 text-gold px-2 py-1 rounded-full whitespace-nowrap">
                            {com.modality}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col gap-6">
                        {/* Board */}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Mesa Directiva</h4>
                          <div className="space-y-2">
                            {com.board.map((member, iIdx) => (
                              <div key={iIdx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                <span className="font-medium text-gray-700">{member.role}</span>
                                <span className="text-gray-500 text-right">{member.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Topics */}
                        <div className="mt-auto">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Tópicos</h4>
                          <div className="space-y-2">
                            {com.topics.map((topic, tIdx) => (
                              <div key={tIdx} className="p-3 bg-snow rounded-lg border border-gray-100">
                                <p className="text-sm text-gray-700 leading-relaxed font-medium">{topic}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
