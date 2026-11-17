import { Component } from '@angular/core';
import { AuthServicesService } from '../../Services/auth-services.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ RouterLink, RouterLinkActive, TranslateModule, LanguageSwitcherComponent ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuAbierto = false;

  notificaciones = [
    { id: 1, titulo: 'NOTIFICATIONS.PENDING_PAYMENT', mensaje: 'NOTIFICATIONS.PENDING_PAYMENT_MESSAGE', fecha: 'NOTIFICATIONS.TODAY', leida: false },
    { id: 2, titulo: 'NOTIFICATIONS.ENROLLMENT_CREATED', mensaje: 'NOTIFICATIONS.ENROLLMENT_CREATED_MESSAGE', fecha: 'NOTIFICATIONS.YESTERDAY', leida: false },
    { id: 3, titulo: 'NOTIFICATIONS.WELCOME', mensaje: 'NOTIFICATIONS.WELCOME_MESSAGE', fecha: 'NOTIFICATIONS.THREE_DAYS_AGO', leida: true }
  ];
  constructor(
    private readonly api: AuthServicesService,
    private readonly _router: Router
  ) {}

  get noLeidas(): number {
    return this.notificaciones.filter((n) => !n.leida).length;
  }

  alternarNotificaciones(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  marcarLeida(n: (typeof this.notificaciones)[number]): void {
    n.leida = true;
  }

  marcarTodas(): void {
    this.notificaciones.forEach((n) => (n.leida = true));
  }


  Salir(): void {
    this.api.Logout();
    this._router.navigate(['']);
  }
}
