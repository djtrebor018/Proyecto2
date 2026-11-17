import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { DiaHorario, EstadoHorario, Horario, HorarioPayload } from '../../models/horario.model';
import { HorarioService } from '../../Services/horario.service';
import { mensajeErrorAdmin } from '../../Services/admin-data.service';

@Component({
  selector: 'app-admin-schedules',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './admin-schedules.component.html'
})
export class AdminSchedulesComponent implements OnInit {
  horarios: Horario[] = [];
  dias: DiaHorario[] = [];
  loading = true;
  error = '';
  mensajeAccion = '';
  exito = false;
  formularioAbierto = false;
  horarioEditando: Horario | null = null;
  horarioPendienteEliminar: number | null = null;
  accionEnCurso = false;

  readonly horarioForm = new FormGroup({
    Dia1: new FormControl<number | null>(null, { validators: [Validators.required] }),
    Dia2: new FormControl<number | null>(null, { validators: [Validators.required] }),
    Hora_Inicio: new FormControl('08:00', { nonNullable: true, validators: [Validators.required] }),
    Hora_Fin: new FormControl('09:00', { nonNullable: true, validators: [Validators.required] }),
    Cumpo_Maximo: new FormControl<number | null>(1, { validators: [Validators.required, Validators.min(1)] }),
    Estado: new FormControl<EstadoHorario>('Disponible', { nonNullable: true, validators: [Validators.required] })
  });

  constructor(private readonly horarioService: HorarioService) {}

  ngOnInit(): void {
    this.cargarHorarios();
  }

  cargarHorarios(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      dias: this.horarioService.getDias(),
      horarios: this.horarioService.getListaHorarios()
    }).subscribe({
      next: ({ dias, horarios }) => {
        this.dias = dias.dias;
        this.horarios = horarios;
        this.loading = false;
      },
      error: (error: unknown) => {
        this.errorAlCargar(error);
      }
    });
  }

  private errorAlCargar(error: unknown): void {
    console.error('Error al cargar los horarios para administración:', error);
    this.error = 'ADMIN.SCHEDULES_ERROR';
    this.loading = false;
  }

  iniciarCreacion(): void {
    this.mensajeAccion = '';
    this.horarioEditando = null;
    this.formularioAbierto = true;
    this.horarioForm.reset({
      Dia1: null,
      Dia2: null,
      Hora_Inicio: '08:00',
      Hora_Fin: '09:00',
      Cumpo_Maximo: 1,
      Estado: 'Disponible'
    });
  }

  iniciarEdicion(horario: Horario): void {
    this.mensajeAccion = '';
    this.formularioAbierto = true;
    this.horarioEditando = horario;
    this.horarioForm.reset({
      Dia1: this.obtenerIdDia(horario.PrimerDia.ID_Dia, horario.PrimerDia.Dia),
      Dia2: this.obtenerIdDia(horario.SegundoDia.ID_Dia, horario.SegundoDia.Dia),
      Hora_Inicio: horario.Hora_Inicio.slice(0, 5),
      Hora_Fin: horario.Hora_Fin.slice(0, 5),
      Cumpo_Maximo: horario.Cumpo_Maximo,
      Estado: horario.Estado
    });
  }

  private obtenerIdDia(idDia: number | undefined, nombre: string): number | null {
    return idDia ?? this.dias.find((dia) => dia.Dia === nombre)?.ID_Dia ?? null;
  }

  cancelarFormulario(): void {
    this.formularioAbierto = false;
    this.horarioEditando = null;
  }

  guardarHorario(): void {
    if (this.horarioForm.invalid) {
      this.horarioForm.markAllAsTouched();
      return;
    }

    const form = this.horarioForm.getRawValue();
    if (!form.Dia1 || !form.Dia2 || !form.Cumpo_Maximo) {
      this.horarioForm.markAllAsTouched();
      return;
    }
    if (form.Hora_Inicio >= form.Hora_Fin) {
      this.mensajeAccion = 'ADMIN.SCHEDULE_INVALID_TIME';
      this.exito = false;
      return;
    }

    const datos: HorarioPayload = {
      Dia1: form.Dia1,
      Dia2: form.Dia2,
      Hora_Inicio: form.Hora_Inicio,
      Hora_Fin: form.Hora_Fin,
      Cumpo_Maximo: form.Cumpo_Maximo,
      Estado: form.Estado
    };

    this.accionEnCurso = true;
    this.mensajeAccion = '';
    const solicitud = this.horarioEditando
      ? this.horarioService.actualizarHorario(this.horarioEditando.ID_Horario, datos)
      : this.horarioService.crearHorario(datos);

    solicitud.subscribe({
      next: () => {
        this.accionEnCurso = false;
        this.formularioAbierto = false;
        this.horarioEditando = null;
        this.mensajeAccion = 'ADMIN.SCHEDULE_SAVED';
        this.exito = true;
        this.cargarHorarios();
      },
      error: (error: unknown) => {
        console.error('Error al guardar horario:', error);
        this.mensajeAccion = mensajeErrorAdmin(error, 'ADMIN.SCHEDULE_SAVE_ERROR');
        this.exito = false;
        this.accionEnCurso = false;
      }
    });
  }

  eliminarHorario(horario: Horario): void {
    this.accionEnCurso = true;
    this.mensajeAccion = '';
    this.horarioService.eliminarHorario(horario.ID_Horario).subscribe({
      next: () => {
        this.accionEnCurso = false;
        this.horarioPendienteEliminar = null;
        this.mensajeAccion = 'ADMIN.SCHEDULE_DELETED';
        this.exito = true;
        this.cargarHorarios();
      },
      error: (error: unknown) => {
        console.error('Error al eliminar horario:', error);
        this.mensajeAccion = mensajeErrorAdmin(error, 'ADMIN.SCHEDULE_DELETE_ERROR');
        this.exito = false;
        this.accionEnCurso = false;
      }
    });
  }
}
