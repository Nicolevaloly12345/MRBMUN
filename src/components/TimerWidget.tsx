import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, AlertCircle, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function TimerWidget({ onTimeUp, onTimeWarning }: { onTimeUp?: () => void, onTimeWarning?: () => void }) {
  const [time, setTime] = useState<number>(60);
  const [inputTime, setInputTime] = useState<number>(60);
  const [isRunning, setIsRunning] = useState(false);
  const hasTriggeredWarning = useRef(false);
  const hasTriggeredTimeUp = useRef(false);
  
  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => {
          const newTime = prev - 1;
          if (newTime === 10 && onTimeWarning && !hasTriggeredWarning.current) {
            hasTriggeredWarning.current = true;
            onTimeWarning();
          }
          if (newTime === 0 && onTimeUp && !hasTriggeredTimeUp.current) {
            hasTriggeredTimeUp.current = true;
            onTimeUp();
          }
          return newTime;
        });
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, onTimeUp, onTimeWarning]);

  const toggleTimer = () => {
    if (!isRunning && time > 0) {
      // Reset triggers when starting
      if (time > 10) hasTriggeredWarning.current = false;
      hasTriggeredTimeUp.current = false;
    }
    setIsRunning(!isRunning);
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setTime(inputTime);
    hasTriggeredWarning.current = false;
    hasTriggeredTimeUp.current = false;
  };

  const setCustomTime = (newTime: number) => {
    setInputTime(newTime);
    setTime(newTime);
    setIsRunning(false);
    hasTriggeredWarning.current = false;
    hasTriggeredTimeUp.current = false;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  let timerColorClass = 'text-burgundy border-gray-200';
  let indicatorColor = 'bg-gray-200';
  
  if (isRunning) {
      if (time > 30) {
        timerColorClass = 'text-emerald-600 border-emerald-200 bg-emerald-50';
        indicatorColor = 'bg-emerald-500';
      } else if (time > 10 && time <= 30) {
        timerColorClass = 'text-amber-500 border-amber-200 bg-amber-50';
        indicatorColor = 'bg-amber-400';
      } else if (time > 0 && time <= 10) {
        timerColorClass = 'text-red-500 border-red-200 bg-red-50';
        indicatorColor = 'bg-red-500';
      } else if (time === 0) {
        timerColorClass = 'text-red-500 border-red-200 bg-red-50';
        indicatorColor = 'bg-red-500 animate-pulse';
      }
  } else if (time === 0) {
      timerColorClass = 'text-red-500 border-red-200 bg-red-50';
      indicatorColor = 'bg-red-500';
  }

  // Advisor logic based on state
  const getAdvisorTip = () => {
      if (time === 0 && !isRunning) return "Sugiera extensión o ceda a la Mesa.";
      if (isRunning && time <= 10) return "Concluya rápido.";
      if (!isRunning && time === inputTime) return "Listo para iniciar.";
      return "Ritmo constante.";
  };

  return (
    <div className="flex gap-4">
      {/* Speech Advisor - Hidden on small mobile */}
      <div className="hidden md:flex flex-col items-end justify-center mr-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Asesor Táctico</span>
        <div className="flex items-center gap-1.5 text-xs text-burgundy/70 bg-gray-50 border border-gray-100 px-2 py-1 rounded">
          <AlertCircle size={12} className="text-gold" />
          {getAdvisorTip()}
        </div>
      </div>

      <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border-2 transition-colors duration-300 ${timerColorClass}`}>
        <div className="flex flex-col items-start pr-3 border-r border-current/20">
            <span className="text-[9px] uppercase tracking-wider font-bold opacity-60">Tiempo</span>
            <div className="text-2xl font-mono font-bold tracking-tight -mt-1 w-[60px]">
                {formatTime(time)}
            </div>
        </div>

        <div className="flex gap-1.5">
          <button 
            onClick={toggleTimer}
            className="p-1.5 rounded-md hover:bg-current/10 transition-colors"
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button 
            onClick={resetTimer}
            className="p-1.5 rounded-md hover:bg-current/10 transition-colors"
          >
            <Square size={18} />
          </button>
        </div>

        <div className="flex items-center gap-1">
            <button onClick={() => setCustomTime(60)} className="text-[10px] px-1.5 py-0.5 rounded font-mono hover:bg-current/10">1m</button>
            <button onClick={() => setCustomTime(90)} className="text-[10px] px-1.5 py-0.5 rounded font-mono hover:bg-current/10">1.5m</button>
        </div>
        
        <div className={`w-2 h-2 rounded-full ml-1 ${indicatorColor}`} />
      </div>
    </div>
  );
}
