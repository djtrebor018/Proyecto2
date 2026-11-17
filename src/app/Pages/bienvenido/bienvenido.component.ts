import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-bienvenido',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './bienvenido.component.html',
  styleUrl: './bienvenido.component.css'
})
export class BienvenidoComponent {
   @Input() Nombre: string = '';


}
