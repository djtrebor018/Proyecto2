import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthServicesService } from './auth-services.service';

@Injectable({
  providedIn: 'root'
})
export class InscripcionesService {
  private baseUrl: string = 'http://localhost:8000/Api/Inscripciones';
  constructor( 
    private _http: HttpClient,
    private _api :AuthServicesService
  ) { }
     
  inscribirUsuario(inscripcion: any) {
     const token = this._api.getToken()
        const headers = new HttpHeaders({
             'token': token || ''
          });
    return this._http.post(`${this.baseUrl}`, inscripcion,{headers});
  }
  obtenerMiHorario() {
  const token = this._api.getToken();
  const headers = new HttpHeaders({ 'token': token || '' });
  return this._http.get<{ inscripciones: any[] }>(`${this.baseUrl}`, { headers });
}

}
