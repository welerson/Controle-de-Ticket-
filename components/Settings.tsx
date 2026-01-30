
import React from 'react';
import { DobraType } from '../types';

interface SettingsProps {
  shiftRate: number;
  setShiftRate: (rate: number) => void;
  selectedDobra: DobraType;
  setSelectedDobra: (dobra: DobraType) => void;
}

const Settings: React.FC<SettingsProps> = ({ shiftRate, selectedDobra, setSelectedDobra }) => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings-2"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
        Configurações da Escala
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Valor por Plantão (Valor Fixo)</label>
          <div className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 text-2xl font-extrabold flex items-center">
            <span className="text-sm font-normal text-slate-500 mr-2">R$</span>
            {shiftRate},00
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">* Valor definido conforme norma vigente</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Sua Dobra (Grupo)</label>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDobra(DobraType.DOBRA_I)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium border transition-all ${
                selectedDobra === DobraType.DOBRA_I
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Dobra I (Azul)
            </button>
            <button
              onClick={() => setSelectedDobra(DobraType.DOBRA_II)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium border transition-all ${
                selectedDobra === DobraType.DOBRA_II
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Dobra II (Preto)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
