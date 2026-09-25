import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ILogin, loginResponse } from '../models/login.model';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class AuthServicesService {

  private baseUrl = 'http://localhost:8000/Api/Auth'

  constructor(
  private _httpclient:HttpClient) {  }

  login(credenciales:ILogin):Observable<loginResponse>{
    return this._httpclient.post<loginResponse>(`${this.baseUrl}/login`,credenciales).pipe(
      tap(Response=>{
        localStorage.setItem('token',Response.token)
      })
    )
  }
  getToken():string | null{
   return localStorage.getItem('token')
  }
  cargarDatos(){
    const token = this.getToken();
  const headers = new HttpHeaders({
     'token': token || ''
  });
  return this._httpclient.get(`${this.baseUrl}`, { headers });
}

Logout(){
  localStorage.clear()
}

registro(datos:Usuario):Observable<loginResponse> {
  return this._httpclient.post<loginResponse>(`${this.baseUrl}/registro`,datos).pipe(
    tap(response =>{
              localStorage.setItem('token',response.token)
    })
  )
}


}
