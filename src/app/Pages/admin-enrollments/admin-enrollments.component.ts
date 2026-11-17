import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AdminDataService, AdminInscripcion, AdminUsuario } from '../../Services/admin-data.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-enrollments',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './admin-enrollments.component.html'
})
export class AdminEnrollmentsComponent implements OnInit {
  inscripciones: AdminInscripcion[] = [];
  usuarios: AdminUsuario[] = [];
  loading = true;
  error = false;

  constructor(private readonly adminData: AdminDataService) {}

  ngOnInit(): void {
    this.cargarInscripciones();
  }

  cargarInscripciones(): void {
    this.loading = true;
    this.error = false;

    forkJoin({
      inscripciones: this.adminData.obtenerInscripciones(),
      usuarios: this.adminData.obtenerUsuarios()
    }).subscribe({
      next: ({ inscripciones, usuarios }) => {
        this.inscripciones = inscripciones.inscripciones;
        this.usuarios = usuarios.usuarios;
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Error al cargar inscripciones para administración:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  nombreUsuario(idUsuario: number): string {
    return this.usuarios.find((usuario) => usuario.ID_Usuario === idUsuario)?.Nombre ?? '—';
  }
}
