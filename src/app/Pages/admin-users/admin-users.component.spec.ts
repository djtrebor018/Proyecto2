import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { AdminDataService, AdminUsuario } from '../../Services/admin-data.service';
import { HorarioService } from '../../Services/horario.service';
import { Router } from '@angular/router';
import { AdminUsersComponent } from './admin-users.component';

describe('AdminUsersComponent', () => {
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;
  let adminData: jasmine.SpyObj<AdminDataService>;
  let horarioService: jasmine.SpyObj<HorarioService>;
  let router: jasmine.SpyObj<Router>;
  const horario = {
    ID_Horario: 5,
    Hora_Inicio: '08:00:00',
    Hora_Fin: '09:00:00',
    Cumpo_Maximo: 8,
    Estado: 'Disponible' as const,
    PrimerDia: { Dia: 'Lunes' as const },
    SegundoDia: { Dia: 'Miercoles' as const }
  };
  const usuarioCreado: AdminUsuario = {
    ID_Usuario: 12,
    Nombre: 'Ana Pérez',
    Correo: 'ana@example.com',
    Tipo_Usuario: 'Externo',
    Matricula: null,
    Cedula: '001-1234567-8',
    Rol: 'Usuario',
    Estado: true
  };

  beforeEach(async () => {
    adminData = jasmine.createSpyObj<AdminDataService>('AdminDataService', [
      'obtenerUsuarios',
      'crearUsuario',
      'actualizarUsuario',
      'desactivarUsuario'
    ]);
    horarioService = jasmine.createSpyObj<HorarioService>('HorarioService', ['getListaHorarios']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    horarioService.getListaHorarios.and.returnValue(of([horario]));
    router.navigate.and.returnValue(Promise.resolve(true));
    adminData.obtenerUsuarios.and.returnValue(of({ usuarios: [] }));
    adminData.crearUsuario.and.returnValue(of({ msg: 'created', usuario: usuarioCreado }));
    adminData.actualizarUsuario.and.returnValue(of({ msg: 'updated', usuario: {} as AdminUsuario }));
    adminData.desactivarUsuario.and.returnValue(of({ msg: 'deactivated' }));

    await TestBed.configureTestingModule({
      imports: [AdminUsersComponent, TranslateModule.forRoot()],
      providers: [
        { provide: AdminDataService, useValue: adminData },
        { provide: HorarioService, useValue: horarioService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates an external user with the selected schedule and opens cashier payment', async () => {
    component.usuarioForm.setValue({
      Nombre: 'Ana Pérez',
      Correo: 'ana@example.com',
      Password: 'secure123',
      Tipo_Usuario: 'Externo',
      Matricula: '',
      Cedula: '001-1234567-8',
      ID_Horario: 5
    });

    component.crearUsuario();
    await fixture.whenStable();

    expect(adminData.crearUsuario).toHaveBeenCalledWith({
      Nombre: 'Ana Pérez',
      Correo: 'ana@example.com',
      Password: 'secure123',
      Tipo_Usuario: 'Externo',
      Cedula: '001-1234567-8'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/admin/pagos'], {
      state: { cashierEnrollment: { usuario: usuarioCreado, ID_Horario: 5 } }
    });
  });

  it('updates only the user fields allowed by the API', () => {
    const user: AdminUsuario = {
      ID_Usuario: 9,
      Nombre: 'Ana',
      Correo: 'ana@example.com',
      Tipo_Usuario: 'Externo',
      Matricula: null,
      Cedula: '001-1234567-8',
      Rol: 'Usuario',
      Estado: true
    };
    component.iniciarEdicion(user);
    component.edicionForm.setValue({ Nombre: 'Ana Pérez', Estado: false });

    component.guardarEdicion();

    expect(adminData.actualizarUsuario).toHaveBeenCalledWith(9, { Nombre: 'Ana Pérez', Estado: false });
  });

  it('uses the API delete operation to deactivate users', () => {
    const user: AdminUsuario = {
      ID_Usuario: 9,
      Nombre: 'Ana',
      Correo: 'ana@example.com',
      Tipo_Usuario: 'Externo',
      Matricula: null,
      Cedula: '001-1234567-8',
      Rol: 'Usuario',
      Estado: true
    };

    component.confirmarDesactivacion(user);

    expect(adminData.desactivarUsuario).toHaveBeenCalledWith(9);
    expect(component.mensajeAccion).toBe('ADMIN.USER_DEACTIVATED');
  });
});
