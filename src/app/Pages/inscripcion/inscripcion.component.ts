import { Component, Input } from '@angular/core';
import { FormGroup, ɵInternalFormsSharedModule } from '@angular/forms';
import { FormBuilder ,Validators} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-inscripcion',
  standalone: true,
  imports: [ReactiveFormsModule, ɵInternalFormsSharedModule],
  templateUrl: './inscripcion.component.html',
  styleUrl: './inscripcion.component.css'
})
export class InscripcionComponent {

 MetodoForm:FormGroup
 @Input() monto:number=0;
 pagoExitoso: boolean = false;
  constructor(
  private fb: FormBuilder,
 private router: Router) {
    this.MetodoForm = this.fb.group({
  Monto: [this.monto, [Validators.required, Validators.min(0)]],
  Metodo_Pago: ['']
 })
   }
  pagar(): void {
    if (this.pagoExitoso) return;   // evita doble clic

    this.pagoExitoso = true;
    setTimeout(() => this.router.navigate(['/dashboard']), 2000);
  }

}


