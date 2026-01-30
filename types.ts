
export enum DobraType {
  DOBRA_I = 'DOBRA_I', // Blue (Azul)
  DOBRA_II = 'DOBRA_II', // Black (Preto)
}

export type StatusPlantao = 'TRABALHADO' | 'ATESTADO_FALTA';

export interface RecordAbsence {
  date: string; // ISO format
  type: StatusPlantao;
}

export interface MonthData {
  monthIndex: number; // 0-11
  year: number;
  totalShifts: number;
  absencesCount: number;
  expectedValue: number;
}
