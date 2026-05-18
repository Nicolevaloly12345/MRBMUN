import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, ArrowRight, RotateCcw, Lightbulb } from 'lucide-react';

type Committee = 'ONUMUJERES' | 'FMI' | 'OMS' | 'CRISIS' | 'FILOSOFICO' | 'DISEC' | 'PRENSA';

const QUIZ_QUESTIONS = [
  {
    question: '¿Cómo prefieres abordar un problema global?',
    options: [
      { text: 'Defendiendo la equidad, los derechos y empoderando minorías.', committee: 'ONUMUJERES' },
      { text: 'Analizando datos financieros y proponiendo planes de desarrollo.', committee: 'FMI' },
      { text: 'Actuando rápido frente a emergencias gubernamentales impredecibles.', committee: 'CRISIS' },
      { text: 'Desarmando conflictos y previniendo la escalada militar.', committee: 'DISEC' }
    ]
  },
  {
    question: 'Si pudieras enfocarte en una misión con impacto mundial, ¿cuál elegirías?',
    options: [
      { text: 'Curar enfermedades y crear sistemas de prevención global.', committee: 'OMS' },
      { text: 'Cuestionar la ética y los motivos detrás de la sociedad moderna.', committee: 'FILOSOFICO' },
      { text: 'Saber la verdad, investigar y difundir la información masivamente.', committee: 'PRENSA' },
      { text: 'Erradicar la discriminación impulsando la justicia y los derechos.', committee: 'ONUMUJERES' }
    ]
  },
  {
    question: 'En una situación crítica repentina, ¿qué rol tomarías?',
    options: [
      { text: 'Tomar decisiones radicales y creativas bajo extrema presión.', committee: 'CRISIS' },
      { text: 'Administrar los presupuestos para garantizar la supervivencia.', committee: 'FMI' },
      { text: 'Ser quien documenta e informa los hechos reales a la población.', committee: 'PRENSA' },
      { text: 'Negociar acuerdos para evitar el uso de la violencia armada.', committee: 'DISEC' }
    ]
  },
  {
    question: '¿Sobre qué tema preferirías debatir durante horas?',
    options: [
      { text: 'Seguridad internacional, amenazas armamentísticas y ciberataques.', committee: 'DISEC' },
      { text: 'Avances médicos, salud mental y control de futuras pandemias.', committee: 'OMS' },
      { text: 'El rol de los medios de comunicación, la censura y la libre expresión.', committee: 'PRENSA' },
      { text: 'Teoría política, fundamentos de la justicia y filosofía moral.', committee: 'FILOSOFICO' }
    ]
  },
  {
    question: 'Durante una discusión, tu principal objetivo es...',
    options: [
      { text: 'Llegar a la raíz del pensamiento y cuestionar las perspectivas.', committee: 'FILOSOFICO' },
      { text: 'Encontrar una solución macroeconómica práctica que funcione.', committee: 'FMI' },
      { text: 'Garantizar que nadie quede excluido y cerrar brechas sistémicas.', committee: 'ONUMUJERES' },
      { text: 'Reaccionar ágilmente ante un giro sorpresa en la negociación.', committee: 'CRISIS' }
    ]
  },
  {
    question: '¿Cuál consideras que es el riesgo más preocupante a futuro?',
    options: [
      { text: 'Una crisis de salud incontrolable y nuevos patógenos.', committee: 'OMS' },
      { text: 'La proliferación nuclear y tensiones entre potencias mundiales.', committee: 'DISEC' },
      { text: 'El retroceso histórico en materia de derechos civiles e igualdad de género.', committee: 'ONUMUJERES' },
      { text: 'La manipulación masiva y desinformación por "fake news".', committee: 'PRENSA' }
    ]
  },
  {
    question: '¿Qué habilidad destacarías de ti mism@?',
    options: [
      { text: 'Estrategia inmediata, improvisación y mente fría frente al caos.', committee: 'CRISIS' },
      { text: 'Empatía y gestión eficiente para promover el bienestar y salud pública.', committee: 'OMS' },
      { text: 'Análisis intelectual profundo, argumentación y oratoria estructurada.', committee: 'FILOSOFICO' },
      { text: 'Lógica aplicada, visión estadística y conocimiento de mercado.', committee: 'FMI' }
    ]
  }
];

export function CommitteeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<Committee, number>>({
    ONUMUJERES: 0, FMI: 0, OMS: 0, CRISIS: 0, FILOSOFICO: 0, DISEC: 0, PRENSA: 0
  });
  const [showResult, setShowResult] = useState(false);

  const [winner, setWinner] = useState<Committee | null>(null);

  const determineWinner = (finalScores: Record<Committee, number>): Committee => {
    let capacities: Record<string, number> = {};
    try {
      const stored = localStorage.getItem('mrbmun_committee_distribution');
      if (stored) capacities = JSON.parse(stored);
    } catch(e) {}

    let candidates: Committee[] = [];
    let maxScore = -100;

    for (const [key, value] of Object.entries(finalScores)) {
      const pastCount = capacities[key] || 0;
      // Drop score slightly based on past recommendations to distribute them
      const adjustedScore = value - (pastCount * 0.15);

      if (adjustedScore > maxScore + 0.01) {
        maxScore = adjustedScore;
        candidates = [key as Committee];
      } else if (Math.abs(adjustedScore - maxScore) <= 0.01) {
        candidates.push(key as Committee);
      }
    }

    const selectedWinner = candidates[Math.floor(Math.random() * candidates.length)] || 'ONUMUJERES';

    capacities[selectedWinner] = (capacities[selectedWinner] || 0) + 1;
    try {
      localStorage.setItem('mrbmun_committee_distribution', JSON.stringify(capacities));
    } catch(e) {}

    return selectedWinner;
  };

  const handleAnswer = (committee: Committee) => {
    const newScores = { ...scores, [committee]: scores[committee] + 1 };
    setScores(newScores);
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setWinner(determineWinner(newScores));
      setShowResult(true);
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#800020', '#FFD700', '#ffffff', '#b3002d']
        });
      });
    }
  };

  const getResultDetails = (winner: Committee) => {
    const results: Record<Committee, { title: string; desc: string }> = {
      ONUMUJERES: { title: 'ONU Mujeres', desc: '¡Tienes un alma defensora! Tu lugar ideal es luchar por la igualdad de género y el empoderamiento de todas las mujeres y niñas.' },
      FMI: { title: 'Fondo Monetario Internacional (FMI)', desc: '¡Tu mente es analítica! Eres clave para resolver problemas económicos, estabilizar finanzas y fomentar el desarrollo global.' },
      OMS: { title: 'Organización Mundial de la Salud (OMS)', desc: '¡Tienes gran vocación de servicio! Tu lugar es velar por la salud global, combatir epidemias y mejorar el bienestar biomédico.' },
      CRISIS: { title: 'Crisis Unicameral', desc: '¡Adrenalina pura! Tienes pensamiento rápido y audaz, ideal para reaccionar ante emergencias gubernamentales, complots y escenarios al límite.' },
      FILOSOFICO: { title: 'Comité Político-Filosófico', desc: '¡Eres un pensador profundo! Tu mente cuestiona las normas sociales, discute sobre la ética, la moral y los fundamentos mismos de la sociedad.' },
      DISEC: { title: 'DISEC', desc: '¡Eres un estratega nato! Lo tuyo es debatir sobre amenazas internacionales, desarme, ciberseguridad y buscar siempre la estabilidad mundial.' },
      PRENSA: { title: 'Prensa', desc: '¡Tu arma es la verdad! Eres un comunicador ágil, investigas los hechos, alertas y mantienes informada a toda la asamblea.' }
    };
    return results[winner];
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScores({ ONUMUJERES: 0, FMI: 0, OMS: 0, CRISIS: 0, FILOSOFICO: 0, DISEC: 0, PRENSA: 0 });
    setShowResult(false);
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 max-w-lg mx-auto w-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full -z-0"></div>
      
      {!showResult ? (
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center text-burgundy">
              <Lightbulb size={20} />
            </span>
            <h3 className="font-serif font-bold text-2xl text-burgundy">Descubre tu Comité Ideal</h3>
          </div>
          
          <div className="mb-4 text-sm font-bold text-gold uppercase tracking-wider">
            Pregunta {currentQuestion + 1} de {QUIZ_QUESTIONS.length}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-xl font-medium text-gray-800 mb-6 min-h-[60px]">
                {QUIZ_QUESTIONS[currentQuestion].question}
              </h4>
              
              <div className="space-y-3">
                {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.committee as Committee)}
                    className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-burgundy hover:bg-burgundy/5 transition-all flex items-center justify-between group"
                  >
                    <span className="text-gray-700 font-medium group-hover:text-burgundy">{option.text}</span>
                    <ArrowRight size={18} className="text-gray-300 group-hover:text-burgundy opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center relative z-10 py-6"
        >
          <div className="w-20 h-20 bg-burgundy rounded-full mx-auto flex items-center justify-center text-white mb-6 shadow-lg shadow-burgundy/30">
            <CheckCircle size={40} />
          </div>
          <h3 className="text-gold font-bold uppercase tracking-widest text-sm mb-2">Tu comité ideal es</h3>
          {winner && (
            <>
              <h2 className="text-3xl font-serif font-bold text-burgundy mb-4">{getResultDetails(winner).title}</h2>
              <p className="text-gray-600 mb-8">{getResultDetails(winner).desc}</p>
            </>
          )}
          
          <button
            onClick={resetQuiz}
            className="text-burgundy font-medium flex items-center justify-center gap-2 mx-auto hover:text-burgundy/80 transition-colors"
          >
            <RotateCcw size={16} /> Hacer de nuevo
          </button>
        </motion.div>
      )}
    </div>
  );
}
