
import { DobraType } from './types';

// O calendário de 2026 fornecido mostra que 01/01/2026 é DOBRA II (Preto)
// A escala é 12x36, alternando dia sim, dia não.
export const BASE_DATE = new Date(2026, 0, 1); // 1º de Janeiro de 2026
export const INITIAL_DOBRA = DobraType.DOBRA_II;

export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
