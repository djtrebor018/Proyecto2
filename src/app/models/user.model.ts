export type TipoUsuario = 'Estudiante' | 'Maestro' | 'Externo';
export type Rol = 'Usuario' | 'Admin';

export interface Usuario {
  ID_Usuario: number;
  Nombre: string;
  Correo: string;
  Password: string;
  Tipo_Usuario: TipoUsuario;
  Matricula: string | null;
  Cedula: string | null;
  Rol: Rol;
  Estado: boolean;
}