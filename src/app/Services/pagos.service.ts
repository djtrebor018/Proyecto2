import { Injectable } from '@angular/core';
import { AuthServicesService } from './auth-services.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
   private baseUrl: string = 'http://localhost:8000/Api/Pagos';

  constructor(
      private _http: HttpClient,
        private _api :AuthServicesService
  ) { }

  realizarPago(pago: { Metodo_Pago: string; Monto: number }): any {
    const token = this._api.getToken();
    const headers = { 'token': token || '' };
    return this._http.post(`${this.baseUrl}`, pago, { headers });
  } 
}
