import { Component, OnInit } from '@angular/core';
import { AuthServicesService } from '../../Services/auth-services.service';
import { LoadingComponent } from '../loading/loading.component';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LoadingComponent,AdminNavbarComponent,NavbarComponent,RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  loading:boolean = true
  Rol:any

  constructor(private api:AuthServicesService){

  }
  ngOnInit(): void {
   setTimeout(() => this.cargarDatos(), 1500);
  }

  cargarDatos(){
    this.api.cargarDatos().subscribe({
      next:(response:any)=>{
      this.loading = false
       this.Rol = response.dataUser.Rol
      },
      error:(err)=>{
         console.error('Login error:', err.error.msg);
      }
    })
  }
}
