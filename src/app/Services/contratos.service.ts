import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contrato, ContratoResponse, ContratosResponse } from '../models/contrato.model';
import { AuthServicesService } from './auth-services.service';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  private readonly baseUrl = 'http://localhost:8000/Api/Contratos';

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthServicesService
  ) {}

  obtenerContratos(): Observable<ContratosResponse> {
    return this.http.get<ContratosResponse>(this.baseUrl, { headers: this.authHeaders() });
  }

  obtenerContrato(id: number): Observable<ContratoResponse> {
    return this.http.get<ContratoResponse>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() });
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ token: this.auth.getToken() ?? '' });
  }
}
