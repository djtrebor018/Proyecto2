import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AdminDataService,
  AdminInscripcion,
  AdminPago,
  AdminUsuario,
  AdminUsuarioBusqueda,
  PagoEnCaja,
  mensajeErrorAdmin
} from '../../Services/admin-data.service';
import { HorarioService } from '../../Services/horario.service';
import { LanguageService } from '../../Services/language.service';
import { Horario } from '../../models/horario.model';
import { Usuario } from '../../models/user.model';
import { formatDop } from '../../utils/currency';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

type TipoUsuarioAdmin = Usuario['Tipo_Usuario'];
type MetodoPagoCaja = PagoEnCaja['Metodo_Pago'];
type MotivoPagoCaja = PagoEnCaja['Motivo_Pago'];

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './admin-payments.component.html'
})
export class AdminPaymentsComponent implements OnInit {
  pagos: AdminPago[] = [];
  usuarios: AdminUsuario[] = [];
  inscripcionesRegistradas: AdminInscripcion[] = [];
  loading = true;
  error = false;
  buscandoUsuario = false;
  registrandoPago = false;
  busquedaError = '';
  pagoError = '';
  pagoExitoso = false;
  usuarioEncontrado: AdminUsuarioBusqueda | null = null;
  inscripciones: AdminInscripcion[] = [];
  horariosDisponibles: Horario[] = [];
  cargandoHorarios = false;
  errorHorarios = '';
  private identificacionActual: { Matricula: string } | { Cedula: string } | null = null;

  readonly busquedaForm = new FormGroup({
    Tipo_Usuario: new FormControl<TipoUsuarioAdmin>('Estudiante', { nonNullable: true }),
    Matricula: new FormControl('', { nonNullable: true }),
    Cedula: new FormControl('', { nonNullable: true })
  });

  readonly pagoCajaForm = new FormGroup({
    ID_Inscripcion: new FormControl<number | null>(null),
    ID_Horario: new FormControl<number | null>(null),
    Motivo_Pago: new FormControl<MotivoPagoCaja>('Inscripción', { nonNullable: true, validators: [Validators.required] }),
    Metodo_Pago: new FormControl<MetodoPagoCaja>('Efectivo', { nonNullable: true, validators: [Validators.required] }),
    Monto: new FormControl<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(0.01),
        Validators.max(99999999.99),
        Validators.pattern(/^\d{1,8}(?:\.\d{1,2})?$/)
      ]
    })
  });

  constructor(
    private readonly adminData: AdminDataService,
    private readonly language: LanguageService,
    private readonly destroyRef: DestroyRef,
    private readonly horarioService: HorarioService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPagos();
    this.cargarHorariosDisponibles();
    this.iniciarDesdeAltaUsuario();
    this.pagoCajaForm.controls.Motivo_Pago.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.actualizarMontoPredeterminado());
  }

  private iniciarDesdeAltaUsuario(): void {
    const state = this.router.getCurrentNavigation()?.extras.state ?? history.state;
    const payload = state?.['cashierEnrollment'];
    if (!this.esDatosAltaUsuario(payload)) {
      return;
    }

    this.usuarioEncontrado = {
      ID_Usuario: payload.usuario.ID_Usuario,
      Nombre: payload.usuario.Nombre,
      Tipo_Usuario: payload.usuario.Tipo_Usuario,
      Matricula: payload.usuario.Matricula,
      Cedula: payload.usuario.Cedula
    };
    this.pagoCajaForm.patchValue({
      ID_Horario: payload.ID_Horario,
      Motivo_Pago: 'Inscripción',
      Monto: 1750
    });
  }

  private esDatosAltaUsuario(value: unknown): value is { usuario: AdminUsuario; ID_Horario: number } {
    if (typeof value !== 'object' || value === null || !('usuario' in value) || !('ID_Horario' in value)) {
      return false;
    }
    const usuario = value.usuario;
    return typeof value.ID_Horario === 'number' &&
      typeof usuario === 'object' && usuario !== null &&
      'ID_Usuario' in usuario && typeof usuario.ID_Usuario === 'number' &&
      'Nombre' in usuario && typeof usuario.Nombre === 'string' &&
      'Tipo_Usuario' in usuario &&
      (usuario.Tipo_Usuario === 'Estudiante' || usuario.Tipo_Usuario === 'Maestro' || usuario.Tipo_Usuario === 'Externo') &&
      'Matricula' in usuario && (typeof usuario.Matricula === 'string' || usuario.Matricula === null) &&
      'Cedula' in usuario && (typeof usuario.Cedula === 'string' || usuario.Cedula === null);
  }

  private cargarHorariosDisponibles(): void {
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
        console.error('Error al cargar horarios disponibles para caja:', error);
        this.errorHorarios = 'ADMIN.SCHEDULES_ERROR';
        this.cargandoHorarios = false;
      }
    });
  }

  cargarPagos(): void {
    this.loading = true;
    this.error = false;

    forkJoin({
      pagos: this.adminData.obtenerPagos(),
      usuarios: this.adminData.obtenerUsuarios(),
      inscripciones: this.adminData.obtenerInscripciones()
    }).subscribe({
      next: ({ pagos, usuarios, inscripciones }) => {
        this.pagos = pagos.pagos;
        this.usuarios = usuarios.usuarios;
        this.inscripcionesRegistradas = inscripciones.inscripciones;
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Error al cargar pagos para administración:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  get identificacionControl(): FormControl<string> {
    return this.busquedaForm.controls.Tipo_Usuario.value === 'Externo'
      ? this.busquedaForm.controls.Cedula
      : this.busquedaForm.controls.Matricula;
  }

  get identificacionLabelKey(): string {
    return this.busquedaForm.controls.Tipo_Usuario.value === 'Externo'
      ? 'REGISTER.ID_NUMBER'
      : 'REGISTER.STUDENT_ID';
  }

  get identificacionFormatKey(): string {
    return this.busquedaForm.controls.Tipo_Usuario.value === 'Externo'
      ? 'ADMIN.CASHIER_ID_NUMBER'
      : 'ADMIN.CASHIER_STUDENT_ID';
  }

  buscarUsuario(): void {
    this.busquedaError = '';
    this.pagoError = '';
    this.pagoExitoso = false;
    this.usuarioEncontrado = null;
    this.inscripciones = [];
    this.identificacionActual = null;

    const tipo = this.busquedaForm.controls.Tipo_Usuario.value;
    const control = this.identificacionControl;
    control.setValidators(tipo === 'Externo'
      ? [Validators.required, Validators.maxLength(20)]
      : [Validators.required, Validators.pattern(/^\d{4}-\d{4}$/)]);
    control.updateValueAndValidity({ emitEvent: false });
    if (control.invalid) {
      control.markAsTouched();
      return;
    }

    const identificacion = control.value.trim();
    this.identificacionActual = tipo === 'Externo'
      ? { Cedula: identificacion }
      : { Matricula: identificacion };
    this.buscandoUsuario = true;

    this.adminData.buscarUsuarioPorIdentificacion(this.identificacionActual).subscribe({
      next: ({ usuario, inscripciones }) => {
        this.usuarioEncontrado = usuario;
        this.inscripciones = inscripciones;
        this.pagoCajaForm.patchValue({
          ID_Inscripcion: inscripciones[0]?.ID_Inscripcion ?? null,
          ID_Horario: null
        });
        this.pagoCajaForm.controls.Motivo_Pago.setValue(
          inscripciones.length > 0 ? 'Mensual' : 'Inscripción'
        );
        this.buscandoUsuario = false;
      },
      error: (error: unknown) => {
        console.error('Error al buscar usuario para registrar un pago en caja:', error);
        this.busquedaError = mensajeErrorAdmin(error, 'ADMIN.CASHIER_USER_NOT_FOUND');
        this.buscandoUsuario = false;
      }
    });
  }

  registrarPago(): void {
    this.pagoError = '';
    this.pagoExitoso = false;
    if (!this.usuarioEncontrado || this.pagoCajaForm.invalid) {
      this.pagoCajaForm.markAllAsTouched();
      return;
    }

    const form = this.pagoCajaForm.getRawValue();
    if (form.Monto === null) {
      this.pagoCajaForm.markAllAsTouched();
      return;
    }

    this.registrandoPago = true;
    if (this.inscripciones.length === 0) {
      if (form.ID_Horario === null) {
        this.pagoCajaForm.controls.ID_Horario.markAsTouched();
        this.registrandoPago = false;
        return;
      }

      this.adminData.crearInscripcionAdmin({
        ID_Usuario: this.usuarioEncontrado.ID_Usuario,
        ID_Horario: form.ID_Horario,
        Metodo_Pago: form.Metodo_Pago,
        Monto: form.Monto
      }).subscribe({
        next: () => this.finalizarRegistroPago(),
        error: (error: unknown) => this.errorAlRegistrarPago(error)
      });
      return;
    }

    if (!this.identificacionActual || form.ID_Inscripcion === null) {
      this.pagoCajaForm.controls.ID_Inscripcion.markAsTouched();
      this.registrandoPago = false;
      return;
    }

    this.adminData.registrarPagoEnCaja({
      ...this.identificacionActual,
      ID_Inscripcion: form.ID_Inscripcion,
      Metodo_Pago: form.Metodo_Pago,
      Motivo_Pago: form.Motivo_Pago,
      Monto: form.Monto
    }).subscribe({
      next: () => this.finalizarRegistroPago(),
      error: (error: unknown) => this.errorAlRegistrarPago(error)
    });
  }

  private errorAlRegistrarPago(error: unknown): void {
    console.error('Error al registrar inscripción o pago en caja:', error);
    this.pagoError = mensajeErrorAdmin(error, 'ADMIN.CASHIER_PAYMENT_ERROR');
    this.registrandoPago = false;
  }

  private finalizarRegistroPago(): void {
    this.registrandoPago = false;
    this.pagoExitoso = true;
    this.usuarioEncontrado = null;
    this.inscripciones = [];
    this.identificacionActual = null;
    this.busquedaForm.controls.Matricula.reset('');
    this.busquedaForm.controls.Cedula.reset('');
    this.pagoCajaForm.reset({
      ID_Inscripcion: null,
      ID_Horario: null,
      Motivo_Pago: 'Inscripción',
      Metodo_Pago: 'Efectivo',
      Monto: null
    });
    this.cargarPagos();
  }

  cancelarBusqueda(): void {
    this.usuarioEncontrado = null;
    this.inscripciones = [];
    this.identificacionActual = null;
    this.busquedaError = '';
    this.pagoError = '';
    this.pagoExitoso = false;
    this.pagoCajaForm.reset({
      ID_Inscripcion: null,
      ID_Horario: null,
      Motivo_Pago: 'Inscripción',
      Metodo_Pago: 'Efectivo',
      Monto: null
    });
  }

  nombreInscripcion(inscripcion: AdminInscripcion): string {
    const horario = inscripcion.Horario;
    if (!horario) {
      return `${inscripcion.ID_Horario} · ${inscripcion.Fecha}`;
    }
    const dias = [horario.PrimerDia?.Dia, horario.SegundoDia?.Dia].filter(Boolean).join(' / ');
    return `${inscripcion.ID_Horario} · ${dias} · ${horario.Hora_Inicio}–${horario.Hora_Fin}`;
  }

  nombreHorario(horario: Horario): string {
    const dias = [horario.PrimerDia?.Dia, horario.SegundoDia?.Dia].filter(Boolean).join(' / ');
    return `${dias} · ${horario.Hora_Inicio}–${horario.Hora_Fin} · ${horario.Cumpo_Maximo} cupos`;
  }

  nombreUsuario(idUsuario: number | undefined): string {
    return this.usuarios.find((usuario) => usuario.ID_Usuario === idUsuario)?.Nombre ?? '—';
  }

  horarioDelPago(pago: AdminPago): string {
    const inscripcion = this.inscripcionesRegistradas.find(
      (item) => item.ID_Inscripcion === pago.ID_Inscripcion
    );
    if (!inscripcion?.Horario) {
      return '—';
    }

    const { Horario: horario } = inscripcion;
    const dias = [horario.PrimerDia?.Dia, horario.SegundoDia?.Dia].filter(Boolean).join(' / ');
    return `${dias} · ${horario.Hora_Inicio}–${horario.Hora_Fin}`;
  }

  actualizarMontoPredeterminado(): void {
    const motivo = this.pagoCajaForm.controls.Motivo_Pago.value;
    const tipoUsuario = this.usuarioEncontrado?.Tipo_Usuario;
    const monto = motivo === 'Inscripción'
      ? 1750
      : tipoUsuario === 'Estudiante' ? 800 : 1500;
    this.pagoCajaForm.controls.Monto.setValue(monto);
  }

  formatearMonto(monto: number): string {
    return formatDop(monto, this.language.currentLanguage);
  }
}
