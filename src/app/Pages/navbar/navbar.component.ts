import { Component } from '@angular/core';
import { AuthServicesService } from '../../Services/auth-services.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ RouterLink, RouterLinkActive ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor( private api:AuthServicesService, private _router:Router){

  }

  Salir(){
    this.api.Logout()
    this._router.navigate([''])
  }
}
