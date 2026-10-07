// types/horario.ts

export type EstadoHorario = 'Disponible' | 'lleno';

export type NombreDia =
  | 'Lunes'
  | 'Martes'
  | 'Miercoles'
  | 'Jueves'
  | 'Viernes'
  | 'Sabado';

export interface DiaNombre {
  Dia: NombreDia;
}

export interface Horario {
  ID_Horario: number;
  Hora_Inicio: string; // 'HH:mm:ss'
  Hora_Fin: string;    // 'HH:mm:ss'
  Cumpo_Maximo: number;
  Estado: EstadoHorario;
  PrimerDia: DiaNombre;
  SegundoDia: DiaNombre;
}

export interface HorariosResponse {
  msg: string;
  Horarios: Horario[];
}
export interface HorarioByIdResponse {
  msg: string;
  HorarioById: Horario;
}