import { Component, inject, OnInit } from '@angular/core';
import { Horario } from '../../models/horario.model';
import { HorarioService } from '../../Services/horario.service';
import { LoadingComponent } from '../loading/loading.component';
import { RouterLink } from '@angular/router';
import { InscripcionesService } from '../../Services/inscripciones.service';
import { catchError, of, switchMap, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [LoadingComponent, RouterLink, TranslateModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent implements OnInit {

  Horario:Horario[] =[]
  errorMessage: string = '';
  loading:boolean = true;
  tieneInscripcion: boolean = false;
  private api = inject(HorarioService)
    private horarioApi = inject(HorarioService);

  private inscripcionApi = inject(InscripcionesService);

   ngOnInit(): void {
    this.inscripcionApi.obtenerMiHorario().pipe(
      switchMap((resp) => {
        const inscripciones = resp.inscripciones ?? [];

        if (inscripciones.length > 0) {
          // Tiene inscripción: solo sus horarios
          this.tieneInscripcion = true;
          return of(inscripciones.map((i: any) => i.Horario) as Horario[]);
        }

        // No tiene inscripción: todos los horarios
        this.tieneInscripcion = false;
        return this.horarioApi.getListaHorarios();
      }),
      catchError((err) => {
        // Sin sesión (401): se comporta como usuario sin inscripción
        if (err.status === 401) {
          this.tieneInscripcion = false;
          return this.horarioApi.getListaHorarios();
        }
        return throwError(() => err);
      })
    ).subscribe({
      next: (data) => {
        this.Horario = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'ERRORS.SCHEDULES_LOAD';
        console.error(this.errorMessage);
        this.loading = false; 
      }
    });
  }
}
  

  
