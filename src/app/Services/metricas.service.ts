import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthServicesService } from './auth-services.service';

export interface ResumenIngreso {
  periodo: string | number;
  total: number;
  cantidadPagos: number;
}

export interface MetricasIngresos {
  zonaHoraria: string;
  moneda: string;
  resumen: {
    dia: ResumenIngreso;
    mes: ResumenIngreso;
    anio: ResumenIngreso;
  };
  ingresosPorMes: ResumenIngreso[];
  ingresosPorDia: ResumenIngreso[];
}

@Injectable({
  providedIn: 'root'
})
export class MetricasService {
  private readonly baseUrl = 'http://localhost:8000/Api/Metricas';

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthServicesService
  ) {}

  obtenerIngresos(): Observable<MetricasIngresos> {
    const headers = new HttpHeaders({
      token: this.auth.getToken() ?? ''
    });

    return this.http.get<MetricasIngresos>(`${this.baseUrl}/ingresos`, { headers });
  }
}
