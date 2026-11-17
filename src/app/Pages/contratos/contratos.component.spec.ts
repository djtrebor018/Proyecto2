import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { Contrato } from '../../models/contrato.model';
import { ContratosService } from '../../Services/contratos.service';
import { AuthServicesService } from '../../Services/auth-services.service';
import { HorarioService } from '../../Services/horario.service';

import { ContratosComponent } from './contratos.component';

describe('ContratosComponent', () => {
  let component: ContratosComponent;
  let fixture: ComponentFixture<ContratosComponent>;
  let contratosService: jasmine.SpyObj<ContratosService>;
  let authService: jasmine.SpyObj<AuthServicesService>;
  let horarioService: jasmine.SpyObj<HorarioService>;

  const contrato: Contrato = {
    ID_Contrato: 7,
    ID_Inscripcion: 12,
    Fecha_Inicio: '2026-09-01',
    Fecha_Fin: null,
    Estado: 'Vigente',
    Inscripcion: {
      ID_Inscripcion: 12,
      ID_Usuario: 4,
      ID_Horario: 3,
      Fecha: '2026-08-25'
    }
  };

  beforeEach(async () => {
    contratosService = jasmine.createSpyObj<ContratosService>('ContratosService', ['obtenerContratos']);
    authService = jasmine.createSpyObj<AuthServicesService>('AuthServicesService', ['cargarDatos']);
    horarioService = jasmine.createSpyObj<HorarioService>('HorarioService', ['getListaHorarios']);
    contratosService.obtenerContratos.and.returnValue(of({ contratos: [] }));
    authService.cargarDatos.and.returnValue(of({
      dataUser: { Nombre: 'Ana', Rol: 'Usuario', Tipo_Usuario: 'Estudiante' }
    }));
    horarioService.getListaHorarios.and.returnValue(of([{
      ID_Horario: 3,
      Hora_Inicio: '08:00:00',
      Hora_Fin: '09:00:00',
      Cumpo_Maximo: 8,
      Estado: 'Disponible',
      PrimerDia: { Dia: 'Lunes' },
      SegundoDia: { Dia: 'Miercoles' }
    }]));

    await TestBed.configureTestingModule({
      imports: [ContratosComponent, TranslateModule.forRoot()],
      providers: [
        { provide: ContratosService, useValue: contratosService },
        { provide: AuthServicesService, useValue: authService },
        { provide: HorarioService, useValue: horarioService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContratosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('loads contract and related enrollment data', () => {
    contratosService.obtenerContratos.and.returnValue(of({ contratos: [contrato] }));
    fixture.detectChanges();

    expect(contratosService.obtenerContratos).toHaveBeenCalled();
    expect(component.contratos).toEqual([contrato]);
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('');
  });

  it('shows a translated error state when loading contracts fails', () => {
    spyOn(console, 'error');
    contratosService.obtenerContratos.and.returnValue(throwError(() => new Error('API unavailable')));
    fixture.detectChanges();

    expect(component.contratos).toEqual([]);
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('ERRORS.CONTRACTS_LOAD');
  });
});
