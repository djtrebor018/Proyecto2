import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminNavbarComponent, RouterOutlet],
  template: `
    <app-admin-navbar></app-admin-navbar>
    <router-outlet></router-outlet>
  `
})
export class AdminLayoutComponent {}
