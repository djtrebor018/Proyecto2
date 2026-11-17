import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,map } from 'rxjs';
import { DiaHorario, Horario, HorarioByIdResponse, HorarioPayload, HorariosResponse } from '../models/horario.model';
import { AuthServicesService } from './auth-services.service';
@Injectable({
  providedIn: 'root'
})
export class HorarioService {

private baseUrl = 'http://localhost:8000/Api/Horarios'
private readonly diasUrl = 'http://localhost:8000/Api/Dias';

  constructor(
    private _httpclient:HttpClient,
    private _api :AuthServicesService

  ) { }

  getHorarios(): Observable<HorariosResponse>{
    const token = this._api.getToken()
    const headers = new HttpHeaders({
         'token': token || ''
      });
      return this._httpclient.get<HorariosResponse>(this.baseUrl,{headers})
  }

  getListaHorarios(): Observable<Horario[]> {
    return this.getHorarios().pipe(map((res) => res.Horarios));
  }

  getHorarioById(id: number): Observable<Horario | undefined> {
    const token = this._api.getToken()
    const headers = new HttpHeaders({
         'token': token || ''
      });
   return this._httpclient.get<HorarioByIdResponse>(`${this.baseUrl}/${id}`,{headers}).pipe(map((res) => res.HorarioById));
  }

  getDias(): Observable<{ msg: string; dias: DiaHorario[] }> {
    return this._httpclient.get<{ msg: string; dias: DiaHorario[] }>(this.diasUrl, {
      headers: this.authHeaders()
    });
  }

  crearHorario(datos: HorarioPayload): Observable<{ msg: string }> {
    return this._httpclient.post<{ msg: string }>(this.baseUrl, datos, {
      headers: this.authHeaders()
    });
  }

  actualizarHorario(id: number, datos: HorarioPayload): Observable<{ msg: string }> {
    return this._httpclient.patch<{ msg: string }>(`${this.baseUrl}/${id}`, datos, {
      headers: this.authHeaders()
    });
  }

  eliminarHorario(id: number): Observable<{ msg: string }> {
    return this._httpclient.delete<{ msg: string }>(`${this.baseUrl}/${id}`, {
      headers: this.authHeaders()
    });
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ token: this._api.getToken() ?? '' });
  }
}
