import { Component, inject, OnInit } from '@angular/core';
import { Horario } from '../../models/horario.model';
import { HorarioService } from '../../Services/horario.service';
import { LoadingComponent } from '../loading/loading.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [LoadingComponent, RouterLink],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent implements OnInit {

  Horario:Horario[] =[]
  errorMessage: string = '';

  loading:boolean = true
  private api = inject(HorarioService)

  ngOnInit(): void {
   setTimeout(()=>{
     this.api.getListaHorarios().subscribe({
      next:(data)=>{
        this.Horario = data
        this.loading = false
      },
      error:(err)=>{
         this.errorMessage = err.error?.errors;
         console.error(this.errorMessage)
      }
    })
   },1000)
  }

  
}
