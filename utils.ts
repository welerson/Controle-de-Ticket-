
import { DobraType, RecordAbsence } from './types';
import { BASE_DATE } from './constants';

/**
 * Calcula qual dobra trabalha em um determinado dia de 2026
 */
export const getDobraForDate = (date: Date): DobraType => {
  // Normalize both dates to start of day in local time for comparison
  const d1 = new Date(BASE_DATE.getFullYear(), BASE_DATE.getMonth(), BASE_DATE.getDate());
  const d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // No dia 0 (01/01/2026), é DOBRA II
  // No dia 1 (02/01/2026), é DOBRA I
  return Math.abs(diffDays) % 2 === 0 ? DobraType.DOBRA_II : DobraType.DOBRA_I;
};

/**
 * Retorna todos os dias de plantão de uma dobra específica num mês/ano
 */
export const getShiftsInMonth = (month: number, year: number, dobra: DobraType): Date[] => {
  const shifts: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    if (getDobraForDate(new Date(date)) === dobra) {
      shifts.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }
  return shifts;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

/**
 * Retorna string YYYY-MM-DD usando componentes locais da data
 * para evitar problemas de fuso horário (timezone offset)
 */
export const getISOString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
