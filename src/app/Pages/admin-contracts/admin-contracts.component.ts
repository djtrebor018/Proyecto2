import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Contrato } from '../../models/contrato.model';
import { ContratosService } from '../../Services/contratos.service';
import { AdminDataService, AdminInscripcion, AdminUsuario } from '../../Services/admin-data.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-contracts',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './admin-contracts.component.html'
})
export class AdminContractsComponent implements OnInit {
  contratos: Contrato[] = [];
  usuarios: AdminUsuario[] = [];
  inscripciones: AdminInscripcion[] = [];
  loading = true;
  error = false;

  constructor(
    private readonly contratosService: ContratosService,
    private readonly adminData: AdminDataService
  ) {}

  ngOnInit(): void {
    this.cargarContratos();
  }

  cargarContratos(): void {
    this.loading = true;
    this.error = false;

    forkJoin({
      contratos: this.contratosService.obtenerContratos(),
      usuarios: this.adminData.obtenerUsuarios(),
      inscripciones: this.adminData.obtenerInscripciones()
    }).subscribe({
      next: ({ contratos, usuarios, inscripciones }) => {
        this.contratos = contratos.contratos;
        this.usuarios = usuarios.usuarios;
        this.inscripciones = inscripciones.inscripciones;
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Error al cargar contratos para administración:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  nombreUsuario(idUsuario: number | undefined): string {
    return this.usuarios.find((usuario) => usuario.ID_Usuario === idUsuario)?.Nombre ?? '—';
  }

  horarioDelContrato(idInscripcion: number): string {
    const inscripcion = this.inscripciones.find((item) => item.ID_Inscripcion === idInscripcion);
    if (!inscripcion?.Horario) {
      return '—';
    }

    const { Horario: horario } = inscripcion;
    const dias = [horario.PrimerDia?.Dia, horario.SegundoDia?.Dia].filter(Boolean).join(' / ');
    return `${dias} · ${horario.Hora_Inicio}–${horario.Hora_Fin}`;
  }
}
