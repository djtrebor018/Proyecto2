import { Component } from '@angular/core';
import {Router, RouterOutlet,NavigationEnd  } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { NavbarComponent } from './Pages/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavbarComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Proyecto2';
   mostrarNavbar: boolean = true;

  private rutasSinNavbar = ['/', '/registro'];

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.mostrarNavbar = !this.rutasSinNavbar.includes(event.urlAfterRedirects);
      }
    });
  }
}
