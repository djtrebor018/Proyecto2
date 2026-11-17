import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthServicesService } from '../../Services/auth-services.service';

import { AdminNavbarComponent } from './admin-navbar.component';

describe('AdminNavbarComponent', () => {
  let component: AdminNavbarComponent;
  let fixture: ComponentFixture<AdminNavbarComponent>;
  let auth: jasmine.SpyObj<AuthServicesService>;
  let router: Router;

  beforeEach(async () => {
    auth = jasmine.createSpyObj<AuthServicesService>('AuthServicesService', ['Logout']);
    await TestBed.configureTestingModule({
      imports: [AdminNavbarComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AuthServicesService, useValue: auth }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the language switcher and logs out', () => {
    const navigate = spyOn(router, 'navigate').and.resolveTo(true);

    expect(fixture.nativeElement.querySelector('app-language-switcher')).toBeTruthy();
    component.salir();

    expect(auth.Logout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['']);
  });

  it('links to all admin sections', () => {
    const root = fixture.nativeElement as HTMLElement;
    const links = Array.from(root.querySelectorAll('.navbar-nav a'))
      .map((link) => link.getAttribute('href'));

    expect(links).toEqual([
      '/dashboard',
      '/admin/usuarios',
      '/admin/inscripciones',
      '/admin/horarios',
      '/admin/pagos',
      '/admin/contratos',
      '/admin/backup'
    ]);
    expect(root.querySelector('input[type="search"]')).toBeNull();
    expect(root.querySelector('form[role="search"]')).toBeNull();
  });
});
