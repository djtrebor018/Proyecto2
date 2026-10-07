import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,map } from 'rxjs';
import { Horario, HorarioByIdResponse, HorariosResponse } from '../models/horario.model';
import { AuthServicesService } from './auth-services.service';
@Injectable({
  providedIn: 'root'
})
export class HorarioService {

private baseUrl = 'http://localhost:8000/Api/Horarios'

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
}
