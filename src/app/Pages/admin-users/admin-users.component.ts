import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AdminDataService, AdminUsuario, mensajeErrorAdmin } from '../../Services/admin-data.service';
import { HorarioService } from '../../Services/horario.service';
import { Horario } from '../../models/horario.model';

type TipoUsuarioAdmin = AdminUsuario['Tipo_Usuario'];

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {
  usuarios: AdminUsuario[] = [];
  loading = true;
  error = '';
  mensajeAccion = '';
  exito = false;
  formularioAbierto = false;
  usuarioEditando: AdminUsuario | null = null;
  usuarioPendienteEliminar: number | null = null;
  accionEnCurso = false;
  horariosDisponibles: Horario[] = [];
  cargandoHorarios = false;
  errorHorarios = '';

  readonly usuarioForm = new FormGroup({
    Nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
    Correo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(50)] }),
    Password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    Tipo_Usuario: new FormControl<TipoUsuarioAdmin>('Estudiante', { nonNullable: true, validators: [Validators.required] }),
    Matricula: new FormControl('', { nonNullable: true }),
    Cedula: new FormControl('', { nonNullable: true }),
    ID_Horario: new FormControl<number | null>(null, { validators: [Validators.required] })
  });

  readonly edicionForm = new FormGroup({
    Nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
    Estado: new FormControl(true, { nonNullable: true })
  });

  constructor(
    private readonly adminData: AdminDataService,
    private readonly horarioService: HorarioService,
    private readonly router: Router
  ) {
    this.usuarioForm.controls.Tipo_Usuario.valueChanges.subscribe((tipo) => this.validarIdentificacion(tipo));
    this.validarIdentificacion(this.usuarioForm.controls.Tipo_Usuario.value);
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  alternarFormulario(): void {
    this.formularioAbierto = !this.formularioAbierto;
    if (this.formularioAbierto) {
      this.cargarHorariosDisponibles();
    }
  }

  cargarHorariosDisponibles(): void {
    this.cargandoHorarios = true;
    this.errorHorarios = '';
    this.horarioService.getListaHorarios().subscribe({
      next: (horarios) => {
        this.horariosDisponibles = horarios.filter(
          (horario) => horario.Estado === 'Disponible' && horario.Cumpo_Maximo > 0
        );
        this.cargandoHorarios = false;
      },
      error: (error: unknown) => {
        console.error('Error al cargar horarios para crear usuario:', error);
        this.errorHorarios = 'ADMIN.SCHEDULES_ERROR';
        this.cargandoHorarios = false;
      }
    });
  }

  nombreHorario(horario: Horario): string {
    const dias = [horario.PrimerDia?.Dia, horario.SegundoDia?.Dia].filter(Boolean).join(' / ');
    return `${dias} · ${horario.Hora_Inicio}–${horario.Hora_Fin} · ${horario.Cumpo_Maximo} cupos`;
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.error = '';

    this.adminData.obtenerUsuarios().subscribe({
      next: ({ usuarios }) => {
        this.usuarios = usuarios;
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Error al cargar usuarios para administración:', error);
        this.error = 'ADMIN.USERS_ERROR';
        this.loading = false;
      }
    });
  }

  private validarIdentificacion(tipo: TipoUsuarioAdmin): void {
    const matricula = this.usuarioForm.controls.Matricula;
    const cedula = this.usuarioForm.controls.Cedula;
    matricula.setValidators(tipo === 'Externo'
      ? []
      : [Validators.required, Validators.pattern(/^\d{4}-\d{4}$/)]);
    cedula.setValidators(tipo === 'Externo'
      ? [Validators.required, Validators.maxLength(20)]
      : []);
    matricula.updateValueAndValidity({ emitEvent: false });
    cedula.updateValueAndValidity({ emitEvent: false });
  }

  crearUsuario(): void {
    this.mensajeAccion = '';
    this.exito = false;
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const form = this.usuarioForm.getRawValue();
    const datos = {
      Nombre: form.Nombre.trim(),
      Correo: form.Correo.trim(),
      Password: form.Password,
      Tipo_Usuario: form.Tipo_Usuario,
      ...(form.Tipo_Usuario === 'Externo'
        ? { Cedula: form.Cedula.trim() }
        : { Matricula: form.Matricula.trim() })
    };

    this.accionEnCurso = true;
    this.adminData.crearUsuario(datos).subscribe({
      next: ({ usuario }) => {
        this.accionEnCurso = false;
        const ID_Horario = form.ID_Horario;
        if (ID_Horario === null) {
          this.mensajeAccion = 'ADMIN.SCHEDULE_REQUIRED';
          this.exito = false;
          this.cargarUsuarios();
          return;
        }
        void this.router.navigate(['/admin/pagos'], {
          state: { cashierEnrollment: { usuario, ID_Horario } }
        }).then((navigated) => {
          if (!navigated) {
            this.mensajeAccion = 'ADMIN.USER_CREATED_PAYMENT_NAVIGATION_ERROR';
            this.exito = false;
            this.formularioAbierto = false;
          }
          this.cargarUsuarios();
        }).catch((error: unknown) => {
          console.error('Usuario creado, pero no se pudo abrir la caja:', error);
          this.mensajeAccion = 'ADMIN.USER_CREATED_PAYMENT_NAVIGATION_ERROR';
          this.exito = false;
          this.formularioAbierto = false;
          this.cargarUsuarios();
        });
      },
      error: (error: unknown) => {
        console.error('Error al crear usuario:', error);
        this.mensajeAccion = mensajeErrorAdmin(error, 'ADMIN.USER_CREATE_ERROR');
        this.accionEnCurso = false;
      }
    });
  }

  iniciarEdicion(usuario: AdminUsuario): void {
    this.mensajeAccion = '';
    this.usuarioEditando = usuario;
    this.edicionForm.reset({ Nombre: usuario.Nombre, Estado: usuario.Estado });
  }

  cancelarEdicion(): void {
    this.usuarioEditando = null;
  }

  guardarEdicion(): void {
    if (!this.usuarioEditando) {
      return;
    }
    if (this.edicionForm.invalid) {
      this.edicionForm.markAllAsTouched();
      return;
    }

    const { Nombre, Estado } = this.edicionForm.getRawValue();
    this.accionEnCurso = true;
    this.mensajeAccion = '';
    this.adminData.actualizarUsuario(this.usuarioEditando.ID_Usuario, { Nombre: Nombre.trim(), Estado }).subscribe({
      next: () => {
        this.accionEnCurso = false;
        this.usuarioEditando = null;
        this.mensajeAccion = 'ADMIN.USER_UPDATED';
        this.exito = true;
        this.cargarUsuarios();
      },
      error: (error: unknown) => {
        console.error('Error al actualizar usuario:', error);
        this.mensajeAccion = mensajeErrorAdmin(error, 'ADMIN.USER_UPDATE_ERROR');
        this.exito = false;
        this.accionEnCurso = false;
      }
    });
  }

  confirmarDesactivacion(usuario: AdminUsuario): void {
    this.accionEnCurso = true;
    this.mensajeAccion = '';
    this.adminData.desactivarUsuario(usuario.ID_Usuario).subscribe({
      next: () => {
        this.accionEnCurso = false;
        this.usuarioPendienteEliminar = null;
        this.mensajeAccion = 'ADMIN.USER_DEACTIVATED';
        this.exito = true;
        this.cargarUsuarios();
      },
      error: (error: unknown) => {
        console.error('Error al desactivar usuario:', error);
        this.mensajeAccion = mensajeErrorAdmin(error, 'ADMIN.USER_DELETE_ERROR');
        this.exito = false;
        this.accionEnCurso = false;
      }
    });
  }

  reactivarUsuario(usuario: AdminUsuario): void {
    this.accionEnCurso = true;
    this.mensajeAccion = '';
    this.adminData.actualizarUsuario(usuario.ID_Usuario, { Estado: true }).subscribe({
      next: () => {
        this.accionEnCurso = false;
        this.mensajeAccion = 'ADMIN.USER_REACTIVATED';
        this.exito = true;
        this.cargarUsuarios();
      },
      error: (error: unknown) => {
        console.error('Error al reactivar usuario:', error);
        this.mensajeAccion = mensajeErrorAdmin(error, 'ADMIN.USER_UPDATE_ERROR');
        this.exito = false;
        this.accionEnCurso = false;
      }
    });
  }
}
