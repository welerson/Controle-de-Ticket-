
import React, { useState } from 'react';
import { MONTH_NAMES, DAYS_OF_WEEK } from '../constants';
import { DobraType, RecordAbsence } from '../types';
import { getDobraForDate, getISOString } from '../utils';

interface CalendarProps {
  monthIndex: number;
  year: number;
  setMonthIndex: (m: number) => void;
  userDobra: DobraType;
  absences: RecordAbsence[];
  onToggleAbsence: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ monthIndex, year, setMonthIndex, userDobra, absences, onToggleAbsence }) => {
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(null);

  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
  
  const startDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, monthIndex, i));
  }

  const handlePrev = () => setMonthIndex(monthIndex > 0 ? monthIndex - 1 : 11);
  const handleNext = () => setMonthIndex(monthIndex < 11 ? monthIndex + 1 : 0);

  const handleDayClick = (date: Date) => {
    setSelectedDateForModal(new Date(date.getTime()));
  };

  const confirmToggle = () => {
    if (selectedDateForModal) {
      onToggleAbsence(selectedDateForModal);
      setSelectedDateForModal(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
      {/* Selection Modal / Window - Redesigned to match user screenshot */}
      {selectedDateForModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] transition-all">
          <div className="bg-white rounded-[40px] p-10 shadow-2xl max-w-sm w-full border border-slate-100 animate-in fade-in zoom-in duration-200 text-center">
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
               <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            </div>
            
            <h4 className="text-2xl font-black text-slate-900 mb-2">Alterar Plantão</h4>
            
            <p className="text-base text-slate-500 mb-8 leading-relaxed">
              Deseja registrar falta ou atestado para o dia <span className="font-bold text-slate-900">{selectedDateForModal.getDate()} de {MONTH_NAMES[monthIndex]}</span>?
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={confirmToggle}
                className="w-full py-5 bg-[#e12a2a] hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-200/50 transition-all active:scale-[0.98] active:shadow-none flex items-center justify-center"
              >
                {absences.some(a => a.date === getISOString(selectedDateForModal)) ? 'Remover Falta' : 'Marcar Falta'}
              </button>
              
              <button 
                onClick={() => setSelectedDateForModal(null)}
                className="w-full py-5 bg-[#f1f5f9] hover:bg-slate-200 text-[#475569] rounded-2xl font-black uppercase tracking-widest transition-all active:scale-[0.98]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-900 px-8 py-6 flex items-center justify-between text-white border-b-4 border-blue-600">
        <h3 className="font-black text-3xl uppercase tracking-tighter">{MONTH_NAMES[monthIndex]} <span className="text-blue-500">{year}</span></h3>
        <div className="flex gap-4">
          <button onClick={handlePrev} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 active:scale-90 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button onClick={handleNext} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 active:scale-90 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-7 gap-3 mb-6">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3 md:gap-4">
          {days.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} className="aspect-square" />;
            
            const dateStr = getISOString(date);
            const shiftDobra = getDobraForDate(date);
            const isMyShift = shiftDobra === userDobra;
            const isAbsence = absences.some(a => a.date === dateStr);
            
            let bgClass = "bg-slate-50 text-slate-200";
            let borderClass = "border-slate-100";

            if (isMyShift) {
                if (isAbsence) {
                    bgClass = "bg-[#e12a2a] text-white border-red-800 shadow-[0_4px_0_#991b1b]";
                } else {
                    bgClass = userDobra === DobraType.DOBRA_I 
                        ? "bg-[#2563eb] text-white border-blue-800 shadow-[0_4px_0_#1e40af]" 
                        : "bg-[#1e293b] text-white border-slate-950 shadow-[0_4px_0_#0f172a]";
                }
            }

            return (
              <button
                key={date.getTime()}
                onClick={() => isMyShift && handleDayClick(date)}
                disabled={!isMyShift}
                className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-2 transition-all relative ${bgClass} ${borderClass} ${isMyShift ? 'hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none cursor-pointer' : 'cursor-default opacity-20 grayscale scale-95'}`}
              >
                <span className={`text-xl md:text-3xl font-black leading-none ${isAbsence ? 'scale-110' : ''}`}>{date.getDate()}</span>
                {isMyShift && (
                  <span className="text-[8px] md:text-[10px] mt-2 font-black uppercase tracking-tighter opacity-80">
                    {isAbsence ? 'FALTA' : 'PLANTÃO'}
                  </span>
                )}
                
                {!isAbsence && isMyShift && (
                   <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white/40" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-8 text-[11px] font-black uppercase tracking-[0.15em] justify-center">
            <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                <div className="w-4 h-4 rounded-full bg-[#2563eb] shadow-sm" />
                <span className="text-blue-900">Dobra I (Azul)</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-200">
                <div className="w-4 h-4 rounded-full bg-[#1e293b] shadow-sm" />
                <span className="text-slate-900">Dobra II (Preto)</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-red-50 rounded-full border border-red-100">
                <div className="w-4 h-4 rounded-full bg-[#e12a2a] shadow-sm animate-pulse" />
                <span className="text-red-700">Falta Registrada</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
