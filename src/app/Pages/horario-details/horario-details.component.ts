import { Component, input } from '@angular/core';
import { HorarioService } from '../../Services/horario.service';
import { ActivatedRoute, Params } from '@angular/router';
import { OnInit,Input } from '@angular/core';
import { Horario } from '../../models/horario.model';
import { LoadingComponent } from '../loading/loading.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-horario-details',
  standalone: true,
  imports: [LoadingComponent, TranslateModule],
  templateUrl: './horario-details.component.html',
  styleUrl: './horario-details.component.css'
})
export class HorarioDetailsComponent implements OnInit {
 
   horario?:Horario ;
   loading: boolean = true;
   @Input() id: string = '';
  constructor(private _route: ActivatedRoute, private _api: HorarioService) { }

 ngOnInit(): void {
   this._api.getHorarioById(Number(this.id)).subscribe({
     next: (res) => {
      console.log('RESPUESTA:', res);
       this.horario = res;
       this.loading = false;
     },
     error: (err) => {
       console.error(err);
       this.loading = false;
     }
   });  
}
}
