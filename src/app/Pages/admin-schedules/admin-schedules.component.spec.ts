import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { DiaHorario } from '../../models/horario.model';
import { HorarioService } from '../../Services/horario.service';
import { AdminSchedulesComponent } from './admin-schedules.component';

describe('AdminSchedulesComponent', () => {
  let component: AdminSchedulesComponent;
  let fixture: ComponentFixture<AdminSchedulesComponent>;
  let horarioService: jasmine.SpyObj<HorarioService>;

  const dias: DiaHorario[] = [
    { ID_Dia: 1, Dia: 'Lunes', Estado: true },
    { ID_Dia: 2, Dia: 'Miercoles', Estado: true }
  ];

  beforeEach(async () => {
    horarioService = jasmine.createSpyObj<HorarioService>('HorarioService', [
      'getDias',
      'getListaHorarios',
      'crearHorario',
      'actualizarHorario',
      'eliminarHorario'
    ]);
    horarioService.getDias.and.returnValue(of({ msg: 'available', dias }));
    horarioService.getListaHorarios.and.returnValue(of([]));
    horarioService.crearHorario.and.returnValue(of({ msg: 'created' }));
    horarioService.actualizarHorario.and.returnValue(of({ msg: 'updated' }));
    horarioService.eliminarHorario.and.returnValue(of({ msg: 'deleted' }));

    await TestBed.configureTestingModule({
      imports: [AdminSchedulesComponent, TranslateModule.forRoot()],
      providers: [{ provide: HorarioService, useValue: horarioService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates a schedule using day IDs from the active day catalog', () => {
    component.iniciarCreacion();
    component.horarioForm.setValue({
      Dia1: 1,
      Dia2: 2,
      Hora_Inicio: '08:00',
      Hora_Fin: '09:00',
      Cumpo_Maximo: 12,
      Estado: 'Disponible'
    });

    component.guardarHorario();

    expect(horarioService.crearHorario).toHaveBeenCalledWith({
      Dia1: 1,
      Dia2: 2,
      Hora_Inicio: '08:00',
      Hora_Fin: '09:00',
      Cumpo_Maximo: 12,
      Estado: 'Disponible'
    });
    expect(component.mensajeAccion).toBe('ADMIN.SCHEDULE_SAVED');
  });

  it('does not send invalid time ranges to the API', () => {
    component.iniciarCreacion();
    component.horarioForm.setValue({
      Dia1: 1,
      Dia2: 2,
      Hora_Inicio: '09:00',
      Hora_Fin: '08:00',
      Cumpo_Maximo: 12,
      Estado: 'Disponible'
    });

    component.guardarHorario();

    expect(horarioService.crearHorario).not.toHaveBeenCalled();
    expect(component.mensajeAccion).toBe('ADMIN.SCHEDULE_INVALID_TIME');
  });
});
