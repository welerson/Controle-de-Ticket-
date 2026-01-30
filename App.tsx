
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Settings from './components/Settings';
import Calendar from './components/Calendar';
import Summary from './components/Summary';
import { DobraType, RecordAbsence } from './types';
import { getISOString } from './utils';
// Added missing import for MONTH_NAMES
import { MONTH_NAMES } from './constants';

const App: React.FC = () => {
  // Persistence key
  const STORAGE_KEY = 'gcm_vale_data_v4';

  // State
  const [shiftRate] = useState<number>(90);
  const [selectedDobra, setSelectedDobra] = useState<DobraType>(DobraType.DOBRA_I);
  const [monthIndex, setMonthIndex] = useState<number>(new Date().getMonth());
  const [year] = useState<number>(2026);
  const [absences, setAbsences] = useState<RecordAbsence[]>([]);

  // Load data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.selectedDobra) setSelectedDobra(parsed.selectedDobra);
        if (parsed.absences) setAbsences(parsed.absences);
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  // Save data on change
  useEffect(() => {
    const data = { selectedDobra, absences };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [selectedDobra, absences]);

  const toggleAbsence = useCallback((date: Date) => {
    const dateStr = getISOString(date);
    setAbsences(prev => {
      const exists = prev.find(a => a.date === dateStr);
      if (exists) {
        return prev.filter(a => a.date !== dateStr);
      } else {
        return [...prev, { date: dateStr, type: 'ATESTADO_FALTA' }];
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Summary & Calendar */}
          <div className="lg:col-span-8">
            <Summary 
              monthIndex={monthIndex}
              year={year}
              shiftRate={shiftRate}
              dobra={selectedDobra}
              absences={absences}
            />
            
            <Calendar 
              monthIndex={monthIndex}
              year={year}
              setMonthIndex={setMonthIndex}
              userDobra={selectedDobra}
              absences={absences}
              onToggleAbsence={toggleAbsence}
            />
          </div>

          {/* Right Column: Settings & Legend */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <Settings 
                shiftRate={shiftRate}
                setShiftRate={() => {}} 
                selectedDobra={selectedDobra}
                setSelectedDobra={setSelectedDobra}
              />

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Como Conferir</h3>
                <ul className="space-y-5">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/></svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Crédito de {MONTH_NAMES[(monthIndex + 1) % 12]}</h4>
                      <p className="text-xs text-slate-500 leading-snug">O valor bruto mostrado refere-se aos plantões que você trabalhará no mês que vem.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Desconto de {MONTH_NAMES[monthIndex === 0 ? 11 : monthIndex - 1]}</h4>
                      <p className="text-xs text-slate-500 leading-snug">Qualquer falta ou atestado que você marcar no mês passado será descontado na folha de agora.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Marcar Faltas</h4>
                      <p className="text-xs text-slate-500 leading-snug">Clique nos seus dias de plantão no calendário para registrar faltas. Elas ficarão <span className="text-red-600 font-bold">vermelhas</span>.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 text-white text-center shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"></div>
                 <p className="text-xs text-slate-400 mb-1 italic">Dúvidas sobre a escala?</p>
                 <p className="text-sm font-bold">Consulte seu supervisor de plantão.</p>
                 <div className="mt-4 pt-4 border-t border-slate-800 flex justify-center">
                    <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase font-black">GCMBH_SYSTEM_V4</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-xs">
        <div className="max-w-xl mx-auto px-4">
          <div className="mb-2 font-medium">© 2026 GCMBH - Sistema de Conferência de Vale Alimentação. Escala 12x36 oficial.</div>
          <div className="h-px w-12 bg-slate-200 mx-auto my-3"></div>
          <div className="font-black text-slate-900 text-sm uppercase tracking-wider">Desenvolvido por GCMIII Welerson Faria</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
