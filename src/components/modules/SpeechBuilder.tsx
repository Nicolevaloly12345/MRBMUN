import React, { useState } from 'react';
import { Copy, CheckCircle2, MessageSquareQuote, Flag, Handshake, ShieldHalf, Zap, Gavel } from 'lucide-react';
import { motion } from 'motion/react';

export default function SpeechBuilder() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    {
      title: "Apertura y Contexto",
      icon: <Flag className="text-burgundy" size={20} />,
      phrases: [
        { en: "We must pivot from rhetoric to resolution.", es: "Debemos pasar de la retórica a la resolución." },
        { en: "History will not forgive our inaction.", es: "La historia no perdonará nuestra inacción." },
        { en: "My delegation firmly believes that...", es: "Mi delegación cree firmemente que..." },
        { en: "This committee stands at a crossroads of history.", es: "Este comité se encuentra en una encrucijada de la historia." },
        { en: "The time for half-measures has passed; the time for decisive action is now.", es: "El tiempo de las medidas a medias ha pasado; el momento de la acción decisiva es ahora." },
        { en: "We cannot simply treat the symptoms; we must address the root causes.", es: "No podemos simplemente tratar los síntomas; debemos abordar las causas profundas." },
        { en: "Ignoring this issue will only amplify the catastrophic consequences.", es: "Ignorar este problema solo amplificará las consecuencias catastróficas." },
      ]
    },
    {
      title: "Cooperación y Consenso",
      icon: <Handshake className="text-burgundy" size={20} />,
      phrases: [
        { en: "We urge all member states to find common ground.", es: "Instamos a todos los estados miembros a encontrar un punto en común." },
        { en: "Diplomacy is not about total victory, but shared progress.", es: "La diplomacia no se trata de una victoria total, sino de progreso compartido." },
        { en: "Let us not let our differences overshadow our shared humanity.", es: "No dejemos que nuestras diferencias eclipsen nuestra humanidad compartida." },
        { en: "True sovereignty is exercised not by isolation, but by strategic cooperation.", es: "La verdadera soberanía no se ejerce mediante el aislamiento, sino a través de la cooperación estratégica." },
        { en: "Let us replace the walls of division with bridges of understanding.", es: "Reemplacemos los muros de la división con puentes de entendimiento." },
        { en: "Multilateralism is the only viable mechanism for a globalized problem.", es: "El multilateralismo es el único mecanismo viable para un problema globalizado." },
        { en: "We extend an open invitation to all delegations to draft a comprehensive framework.", es: "Extendemos una invitación abierta a todas las delegaciones para redactar un marco integral." },
        { en: "Compromise is not a sign of weakness; it is the hallmark of effective diplomacy.", es: "El compromiso no es un signo de debilidad; es el sello distintivo de una diplomacia efectiva." },
      ]
    },
    {
      title: "Refutación y Debate",
      icon: <ShieldHalf className="text-burgundy" size={20} />,
      phrases: [
        { en: "While we respect the delegate's perspective, the facts paint a vastly different picture.", es: "Si bien respetamos la perspectiva del delegado, los hechos pintan un panorama muy diferente." },
        { en: "We cannot build a robust resolution on a foundation of hollow promises.", es: "No podemos construir una resolución sólida sobre una base de promesas vacías." },
        { en: "Short-sighted solutions will inevitably lead to long-term disasters.", es: "Las soluciones a corto plazo conducirán inevitablemente a desastres a largo plazo." },
        { en: "My delegation finds it paradoxical that...", es: "Mi delegación encuentra paradójico que..." },
        { en: "A resolution without enforcement mechanisms is merely a suggestion.", es: "Una resolución sin mecanismos de aplicación es simplemente una sugerencia." },
        { en: "We must respectfully disagree with the premise presented by the previous speaker.", es: "Debemos respetuosamente estar en desacuerdo con la premisa presentada por el orador anterior." },
        { en: "The proposed strategy is fundamentally flawed.", es: "La estrategia propuesta es fundamentalmente defectuosa." },
      ]
    },
    {
      title: "Impacto y Cierre",
      icon: <Zap className="text-burgundy" size={20} />,
      phrases: [
        { en: "A chain is only as strong as its weakest link.", es: "Una cadena es tan fuerte como su eslabón más débil." },
        { en: "The cost of complacency is a price our future generations cannot afford to pay.", es: "El costo de la complacencia es un precio que las futuras generaciones no pueden pagar." },
        { en: "Let us leave this session not just with words on paper, but with a blueprint for a better world.", es: "Salgamos de esta sesión no solo con palabras, sino con un plan para un mundo mejor." },
        { en: "We are not just drafting a resolution; we are drafting the future.", es: "No solo estamos redactando una resolución; estamos redactando el futuro." },
        { en: "Action delayed is prosperity denied.", es: "La acción retrasada es prosperidad denegada." },
        { en: "Let our legacy be one of courage, not of abdication.", es: "Que nuestro legado sea de valentía, no de abdicación." },
        { en: "It is time to move from dialogue to deliverance.", es: "Es tiempo de pasar del diálogo a la liberación de resultados." },
      ]
    },
    {
      title: "Protocolo y Mociones",
      icon: <Gavel className="text-burgundy" size={20} />,
      phrases: [
        { en: "The delegation of [Country] yields the rest of its time to the chair.", es: "La delegación de [País] cede el resto de su tiempo a la mesa." },
        { en: "We raise a motion for a moderated caucus.", es: "Proponemos una moción para un caucus moderado." },
        { en: "We raise a motion for an unmoderated caucus.", es: "Proponemos una moción para un caucus inmoderado." },
        { en: "We call for a point of clarification.", es: "Pedimos un punto de aclaración." },
        { en: "Point of order, honorable chair.", es: "Punto de orden, honorable mesa." },
        { en: "Point of personal privilege.", es: "Punto de privilegio personal." },
        { en: "We motion to open the speaker's list.", es: "Proponemos una moción para abrir la lista de oradores." },
        { en: "We motion to close the debate on the current topic.", es: "Proponemos una moción para cerrar el debate sobre el tema actual." },
      ]
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="pb-20">
      <div className="bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#E5E7EB] min-h-[600px] p-6 md:p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-4 border-b border-gray-100 pb-6">
            <div className="p-4 bg-gold/20 rounded-2xl">
              <MessageSquareQuote className="text-gold" size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-burgundy">Frases Poderosas</h2>
              <p className="text-sm text-gray-500 mt-2">Eleva tu retórica durante el debate. Úsalas en tus intervenciones. Haz clic para copiar.</p>
            </div>
          </div>

          <div className="space-y-12">
            {categories.map((category, catIdx) => (
              <div key={catIdx} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-burgundy/10">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 border-b-2 border-gold/30 pb-1">
                    {category.title}
                  </h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {category.phrases.map((phrase, phraseIdx) => {
                    const uniqueId = `${catIdx}-${phraseIdx}`;
                    return (
                      <div key={uniqueId} className="p-5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gold/40 transition-all group flex items-start justify-between gap-4">
                        <div>
                          <p className="font-serif font-semibold text-burgundy text-lg mb-1">{phrase.es}</p>
                          <p className="text-sm text-gray-500 italic">{phrase.en}</p>
                        </div>
                        <button 
                          onClick={() => handleCopy(phrase.es, uniqueId)}
                          className="p-2.5 rounded-lg bg-gray-100 hover:bg-gold/20 text-gray-500 hover:text-burgundy transition-colors shrink-0"
                          title="Copiar frase al portapapeles"
                        >
                          {copiedId === uniqueId ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Copy size={20} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
