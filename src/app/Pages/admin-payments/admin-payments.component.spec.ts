import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { AdminDataService, AdminPago } from '../../Services/admin-data.service';
import { LanguageService } from '../../Services/language.service';
import { HorarioService } from '../../Services/horario.service';
import { Router } from '@angular/router';
import { AdminPaymentsComponent } from './admin-payments.component';

describe('AdminPaymentsComponent', () => {
  let component: AdminPaymentsComponent;
  let fixture: ComponentFixture<AdminPaymentsComponent>;
  let adminData: jasmine.SpyObj<AdminDataService>;
  let horarioService: jasmine.SpyObj<HorarioService>;

  const pago: AdminPago = {
    ID_Pago: 1,
    ID_Inscripcion: 3,
    Metodo_Pago: 'Efectivo',
    Motivo_Pago: 'Inscripción',
    Monto: 1750,
    Estado: 'Realizado',
    Fecha_Pago: '2026-11-05'
  };

  beforeEach(async () => {
    adminData = jasmine.createSpyObj<AdminDataService>('AdminDataService', [
      'obtenerPagos',
      'obtenerUsuarios',
      'obtenerInscripciones',
      'buscarUsuarioPorIdentificacion',
      'registrarPagoEnCaja',
      'crearInscripcionAdmin'
    ]);
    horarioService = jasmine.createSpyObj<HorarioService>('HorarioService', ['getListaHorarios']);
    horarioService.getListaHorarios.and.returnValue(of([]));
    adminData.obtenerPagos.and.returnValue(of({ pagos: [] }));
    adminData.obtenerUsuarios.and.returnValue(of({
      usuarios: [{
        ID_Usuario: 4,
        Nombre: 'Ana',
        Correo: 'ana@example.com',
        Tipo_Usuario: 'Externo',
        Matricula: null,
        Cedula: '001-1234567-8',
        Rol: 'Usuario',
        Estado: true
      }]
    }));
    adminData.obtenerInscripciones.and.returnValue(of({
      inscripciones: [{
        ID_Inscripcion: 3,
        ID_Usuario: 4,
        ID_Horario: 2,
        Fecha: '2026-11-01',
        Horario: {
          ID_Horario: 2,
          Hora_Inicio: '08:00:00',
          Hora_Fin: '09:00:00',
          PrimerDia: { Dia: 'Lunes' },
          SegundoDia: { Dia: 'Miercoles' }
        }
      }]
    }));
    adminData.buscarUsuarioPorIdentificacion.and.returnValue(of({
      usuario: {
        ID_Usuario: 4,
        Nombre: 'Ana',
        Tipo_Usuario: 'Externo',
        Matricula: null,
        Cedula: '001-1234567-8'
      },
      inscripciones: [{ ID_Inscripcion: 3, ID_Usuario: 4, ID_Horario: 2, Fecha: '2026-11-01' }]
    }));
    adminData.registrarPagoEnCaja.and.returnValue(of({ msg: 'created', pago }));
    adminData.crearInscripcionAdmin.and.returnValue(of({
      msg: 'created',
      inscripcion: { ID_Inscripcion: 10, ID_Usuario: 4, ID_Horario: 5, Fecha: '2026-11-05' }
    }));

    await TestBed.configureTestingModule({
      imports: [AdminPaymentsComponent, TranslateModule.forRoot()],
      providers: [
        { provide: AdminDataService, useValue: adminData },
        { provide: LanguageService, useValue: { currentLanguage: 'es' } },
        { provide: HorarioService, useValue: horarioService },
        { provide: Router, useValue: { getCurrentNavigation: () => null } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('searches external users by ID number and records cashier payments', () => {
    component.busquedaForm.controls.Tipo_Usuario.setValue('Externo');
    component.busquedaForm.controls.Cedula.setValue('001-1234567-8');
    component.buscarUsuario();

    expect(adminData.buscarUsuarioPorIdentificacion).toHaveBeenCalledWith({ Cedula: '001-1234567-8' });
    expect(component.usuarioEncontrado?.ID_Usuario).toBe(4);
    expect(component.inscripciones[0].ID_Inscripcion).toBe(3);

    component.pagoCajaForm.setValue({
      ID_Inscripcion: 3,
      ID_Horario: null,
      Motivo_Pago: 'Mensual',
      Metodo_Pago: 'Transferencia',
      Monto: 800
    });
    component.registrarPago();

    expect(adminData.registrarPagoEnCaja).toHaveBeenCalledWith({
      Cedula: '001-1234567-8',
      ID_Inscripcion: 3,
      Metodo_Pago: 'Transferencia',
      Motivo_Pago: 'Mensual',
      Monto: 800
    });
    expect(component.pagoExitoso).toBeTrue();
  });

  it('formats schedule labels from the selected user enrollments', () => {
    expect(component.nombreInscripcion({
      ID_Inscripcion: 5,
      ID_Usuario: 2,
      ID_Horario: 9,
      Fecha: '2026-10-10'
    })).toBe('9 · 2026-10-10');
  });

  it('resolves payment rows to the user name and full schedule details', () => {
    component.cargarPagos();

    expect(component.nombreUsuario(4)).toBe('Ana');
    expect(component.horarioDelPago(pago)).toBe('Lunes / Miercoles · 08:00:00–09:00:00');
  });

  it('sets the monthly amount to DOP 800 for students with an enrollment', () => {
    component.busquedaForm.controls.Tipo_Usuario.setValue('Estudiante');
    adminData.buscarUsuarioPorIdentificacion.and.returnValue(of({
      usuario: {
        ID_Usuario: 7,
        Nombre: 'Estudiante',
        Tipo_Usuario: 'Estudiante',
        Matricula: '2023-1010',
        Cedula: null
      },
      inscripciones: [{ ID_Inscripcion: 3, ID_Usuario: 7, ID_Horario: 2, Fecha: '2026-11-01' }]
    }));
    component.busquedaForm.controls.Matricula.setValue('2023-1010');

    component.buscarUsuario();

    expect(component.pagoCajaForm.controls.Motivo_Pago.value).toBe('Mensual');
    expect(component.pagoCajaForm.controls.Monto.value).toBe(800);
  });

  it('sets the enrollment amount to DOP 1750 when the user has no enrollment', () => {
    adminData.buscarUsuarioPorIdentificacion.and.returnValue(of({
      usuario: {
        ID_Usuario: 7,
        Nombre: 'Estudiante',
        Tipo_Usuario: 'Estudiante',
        Matricula: '2023-1010',
        Cedula: null
      },
      inscripciones: []
    }));
    component.busquedaForm.controls.Matricula.setValue('2023-1010');

    component.buscarUsuario();

    expect(component.pagoCajaForm.controls.Motivo_Pago.value).toBe('Inscripción');
    expect(component.pagoCajaForm.controls.Monto.value).toBe(1750);
  });

  it('creates enrollment and payment for a user without an enrollment', () => {
    adminData.buscarUsuarioPorIdentificacion.and.returnValue(of({
      usuario: {
        ID_Usuario: 7,
        Nombre: 'Estudiante',
        Tipo_Usuario: 'Estudiante',
        Matricula: '2023-1010',
        Cedula: null
      },
      inscripciones: []
    }));
    component.busquedaForm.controls.Matricula.setValue('2023-1010');
    component.buscarUsuario();
    component.pagoCajaForm.controls.ID_Horario.setValue(5);

    component.registrarPago();

    expect(adminData.crearInscripcionAdmin).toHaveBeenCalledWith({
      ID_Usuario: 7,
      ID_Horario: 5,
      Metodo_Pago: 'Efectivo',
      Monto: 1750
    });
    expect(component.pagoExitoso).toBeTrue();
  });

  it('sets the monthly amount to DOP 1500 for non-students with an enrollment', () => {
    component.usuarioEncontrado = {
      ID_Usuario: 8,
      Nombre: 'Maestro',
      Tipo_Usuario: 'Maestro',
      Matricula: '2023-1011',
      Cedula: null
    };
    component.pagoCajaForm.controls.Motivo_Pago.setValue('Mensual');

    component.actualizarMontoPredeterminado();

    expect(component.pagoCajaForm.controls.Monto.value).toBe(1500);
  });
});
