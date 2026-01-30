
import React from 'react';
import { MONTH_NAMES } from '../constants';
import { formatCurrency, getShiftsInMonth, getISOString } from '../utils';
import { DobraType, RecordAbsence } from '../types';

interface SummaryProps {
  monthIndex: number;
  year: number;
  shiftRate: number;
  dobra: DobraType;
  absences: RecordAbsence[];
}

const Summary: React.FC<SummaryProps> = ({ 
  monthIndex, 
  year, 
  shiftRate, 
  dobra, 
  absences
}) => {
  // CRÉDITO: O vale recebido no mês ATUAL é para os plantões do Mês SEGUINTE (N+1)
  const nextMonthIndex = (monthIndex + 1) % 12;
  const nextMonthYear = nextMonthIndex === 0 ? year + 1 : year;
  const nextMonthShifts = getShiftsInMonth(nextMonthIndex, nextMonthYear, dobra);
  const nextMonthShiftsCount = nextMonthShifts.length;
  const grossValue = nextMonthShiftsCount * shiftRate;

  // DÉBITO: O desconto no Mês ATUAL refere-se às faltas ocorridas no Mês PASSADO (N-1)
  const prevMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
  const prevMonthYear = monthIndex === 0 ? year - 1 : year;
  
  const shiftsPrevMonth = getShiftsInMonth(prevMonthIndex, prevMonthYear, dobra);
  const absencesPrevMonth = absences.filter(a => {
    return shiftsPrevMonth.some(s => getISOString(s) === a.date);
  });
  
  const totalDeductionDays = absencesPrevMonth.length;
  const deductionValue = totalDeductionDays * shiftRate;
  
  const netValue = grossValue - deductionValue;

  // Faltas marcadas no mês VISUALIZADO (que serão descontadas no PRÓXIMO mês)
  const shiftsVisibleMonth = getShiftsInMonth(monthIndex, year, dobra);
  const absencesVisibleMonth = absences.filter(a => {
    return shiftsVisibleMonth.some(s => getISOString(s) === a.date);
  });

  return (
    <div className="bg-white border-2 border-blue-100 rounded-3xl p-6 mb-8 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
        <div className="flex-1">
          <h3 className="text-slate-900 font-black text-2xl mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
            Folha de {MONTH_NAMES[monthIndex]} / {year}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Crédito Programado</span>
              <div className="text-slate-800 font-bold text-sm">
                {nextMonthShiftsCount} plantões em {MONTH_NAMES[nextMonthIndex]}
              </div>
              <div className="text-emerald-700 font-black text-xl">{formatCurrency(grossValue)}</div>
            </div>

            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl">
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block mb-1">Descontos Aplicados</span>
              <div className="text-slate-800 font-bold text-sm">
                {totalDeductionDays} faltas em {MONTH_NAMES[prevMonthIndex]}
              </div>
              <div className="text-rose-700 font-black text-xl">-{formatCurrency(deductionValue)}</div>
            </div>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Total de Faltas em {MONTH_NAMES[monthIndex]}
              </label>
              <div className="text-3xl font-black text-red-600 italic">
                {absencesVisibleMonth.length} <span className="text-sm not-italic text-slate-400 uppercase">Dias</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-tight max-w-[120px]">
                Desconto previsto para {MONTH_NAMES[nextMonthIndex]}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl text-right min-w-[280px] self-stretch flex flex-col justify-center border-b-8 border-blue-600">
          <div className="text-blue-400 text-xs uppercase font-black tracking-[0.2em] mb-2">Líquido a Receber</div>
          <div className="text-5xl font-black text-white mb-2 tracking-tighter">{formatCurrency(netValue)}</div>
          <div className="h-px bg-white/10 my-4"></div>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            Cálculo baseado no valor fixo de <span className="text-white font-bold">R$ 90,00</span> por plantão.
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-[11px] text-blue-700 font-semibold italic">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        <span>Para registrar uma falta, clique no dia do seu plantão no calendário e confirme na janela que abrirá.</span>
      </div>
    </div>
  );
};

export default Summary;
