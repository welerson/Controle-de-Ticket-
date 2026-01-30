
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">GCM - BH</h1>
            <p className="text-xs text-slate-400">Conferência de Vale Alimentação 2026</p>
          </div>
        </div>
        <div className="hidden md:block text-sm font-medium text-slate-300">
          Escala 12x36 • Belo Horizonte
        </div>
      </div>
    </header>
  );
};

export default Header;
