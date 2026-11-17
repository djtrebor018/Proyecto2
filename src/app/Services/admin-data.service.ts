import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthServicesService } from './auth-services.service';
import { Usuario } from '../models/user.model';

export type AdminUsuario = Omit<Usuario, 'Password'>;
export type AdminUsuarioNuevo = Pick<Usuario, 'Nombre' | 'Correo' | 'Password' | 'Tipo_Usuario'> &
  Partial<Pick<Usuario, 'Matricula' | 'Cedula'>>;

export interface AdminUsuarioBusqueda {
  ID_Usuario: number;
  Nombre: string;
  Tipo_Usuario: Usuario['Tipo_Usuario'];
  Matricula: string | null;
  Cedula: string | null;
}

export interface PagoEnCaja {
  ID_Inscripcion: number;
  Metodo_Pago: 'Efectivo' | 'Paypal' | 'Tarjeta' | 'Transferencia';
  Motivo_Pago: 'Inscripción' | 'Mensual';
  Monto: number;
  Matricula?: string;
  Cedula?: string;
}

export interface InscripcionAdminNueva {
  ID_Usuario: number;
  ID_Horario: number;
  Metodo_Pago: PagoEnCaja['Metodo_Pago'];
  Monto: number;
}

export interface AdminInscripcion {
  ID_Inscripcion: number;
  ID_Usuario: number;
  ID_Horario: number;
  Fecha: string;
  Horario?: {
    ID_Horario: number;
    Hora_Inicio: string;
    Hora_Fin: string;
    PrimerDia?: { Dia: string };
    SegundoDia?: { Dia: string };
  } | null;
}

export interface AdminPago {
  ID_Pago: number;
  ID_Inscripcion: number;
  Metodo_Pago: string;
  Motivo_Pago: string;
  Monto: number;
  Estado: string;
  Fecha_Pago: string;
  Inscripcion?: {
    ID_Inscripcion: number;
    ID_Usuario: number;
    ID_Horario: number;
    Fecha: string;
  } | null;
}

export function mensajeErrorAdmin(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse) || typeof error.error !== 'object' || error.error === null) {
    return fallback;
  }

  const body = error.error as { msg?: unknown; errors?: unknown };
  if (typeof body.msg === 'string') {
    return body.msg;
  }
  if (Array.isArray(body.errors)) {
    const messages = body.errors
      .filter((item): item is { msg: string } =>
        typeof item === 'object' && item !== null && 'msg' in item && typeof item.msg === 'string'
      )
      .map((item) => item.msg);
    if (messages.length > 0) {
      return messages.join(' | ');
    }
  }
  return fallback;
}

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  private readonly baseUrl = 'http://localhost:8000/Api';

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthServicesService
  ) {}

  obtenerUsuarios(): Observable<{ usuarios: AdminUsuario[] }> {
    return this.http.get<{ usuarios: AdminUsuario[] }>(`${this.baseUrl}/Usuarios`, {
      headers: this.authHeaders()
    });
  }

  crearUsuario(datos: AdminUsuarioNuevo): Observable<{ msg: string; usuario: AdminUsuario }> {
    return this.http.post<{ msg: string; usuario: AdminUsuario }>(
      `${this.baseUrl}/Usuarios`,
      datos,
      { headers: this.authHeaders() }
    );
  }

  actualizarUsuario(
    id: number,
    cambios: Partial<Pick<AdminUsuario, 'Nombre' | 'Estado'>>
  ): Observable<{ msg: string; usuario: AdminUsuario }> {
    return this.http.patch<{ msg: string; usuario: AdminUsuario }>(
      `${this.baseUrl}/Usuarios/${id}`,
      cambios,
      { headers: this.authHeaders() }
    );
  }

  desactivarUsuario(id: number): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.baseUrl}/Usuarios/${id}`, {
      headers: this.authHeaders()
    });
  }

  buscarUsuarioPorIdentificacion(
    identificacion: { Matricula: string } | { Cedula: string }
  ): Observable<{ usuario: AdminUsuarioBusqueda; inscripciones: AdminInscripcion[] }> {
    return this.http.post<{ usuario: AdminUsuarioBusqueda; inscripciones: AdminInscripcion[] }>(
      `${this.baseUrl}/Usuarios/buscar`,
      identificacion,
      { headers: this.authHeaders() }
    );
  }

  registrarPagoEnCaja(datos: PagoEnCaja): Observable<{ msg: string; pago: AdminPago }> {
    return this.http.post<{ msg: string; pago: AdminPago }>(
      `${this.baseUrl}/Usuarios/pagos`,
      datos,
      { headers: this.authHeaders() }
    );
  }

  crearInscripcionAdmin(datos: InscripcionAdminNueva): Observable<{ msg: string; inscripcion: AdminInscripcion }> {
    return this.http.post<{ msg: string; inscripcion: AdminInscripcion }>(
      `${this.baseUrl}/Inscripciones/admin`,
      datos,
      { headers: this.authHeaders() }
    );
  }

  obtenerInscripciones(): Observable<{ inscripciones: AdminInscripcion[] }> {
    return this.http.get<{ inscripciones: AdminInscripcion[] }>(`${this.baseUrl}/Inscripciones/admin`, {
      headers: this.authHeaders()
    });
  }

  obtenerPagos(): Observable<{ pagos: AdminPago[] }> {
    return this.http.get<{ pagos: AdminPago[] }>(`${this.baseUrl}/Pagos`, {
      headers: this.authHeaders()
    });
  }

  descargarBackup(): Observable<HttpResponse<Blob>> {
    return this.http.post(`${this.baseUrl}/Backups`, {}, {
      headers: this.authHeaders(),
      observe: 'response',
      responseType: 'blob'
    });
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ token: this.auth.getToken() ?? '' });
  }
}
