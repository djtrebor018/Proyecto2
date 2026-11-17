import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Contrato } from '../../models/contrato.model';
import { ContratosService } from '../../Services/contratos.service';
import { AuthServicesService } from '../../Services/auth-services.service';
import { HorarioService } from '../../Services/horario.service';
import { Horario } from '../../models/horario.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './contratos.component.html',
  styleUrl: './contratos.component.css'
})
export class ContratosComponent implements OnInit {
  contratos: Contrato[] = [];
  nombreUsuario = '';
  horarios: Horario[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private readonly contratosService: ContratosService,
    private readonly auth: AuthServicesService,
    private readonly horarioService: HorarioService
  ) {}

  ngOnInit(): void {
    forkJoin({
      response: this.contratosService.obtenerContratos(),
      usuario: this.auth.cargarDatos(),
      horarios: this.horarioService.getListaHorarios()
    }).subscribe({
      next: ({ response, usuario, horarios }) => {
        this.contratos = response.contratos;
        this.nombreUsuario = usuario.dataUser.Nombre;
        this.horarios = horarios;
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Error al cargar contratos:', error);
        this.errorMessage = 'ERRORS.CONTRACTS_LOAD';
        this.loading = false;
      }
    });
  }

  horarioPorId(idHorario: number): Horario | undefined {
    return this.horarios.find((horario) => horario.ID_Horario === idHorario);
  }
}
