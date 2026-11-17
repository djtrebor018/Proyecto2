export interface InscripcionContrato {
  ID_Inscripcion: number;
  ID_Usuario: number;
  ID_Horario: number;
  Fecha: string;
}

export type EstadoContrato = 'Vigente' | 'Cancelado';

export interface Contrato {
  ID_Contrato: number;
  ID_Inscripcion: number;
  Fecha_Inicio: string;
  Fecha_Fin: string | null;
  Estado: EstadoContrato;
  Inscripcion?: InscripcionContrato;
}

export interface ContratosResponse {
  contratos: Contrato[];
}

export interface ContratoResponse {
  contrato: Contrato;
}
