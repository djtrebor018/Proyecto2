import { Component } from '@angular/core';
import { HorarioDetailsComponent } from '../horario-details/horario-details.component';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { InscripcionComponent } from '../inscripcion/inscripcion.component';
@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [HorarioDetailsComponent, InscripcionComponent],
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.css'
})
export class PagosComponent implements OnInit {

 constructor(private _route: ActivatedRoute) { }
 id:string='';
 Monto: number = 1500;
 Metodo_Pago: string = '';
 ngOnInit(): void {
  this._route.params.subscribe({
    next: (params) => {
      this.id = params['id'];
    }
  })


}
}
