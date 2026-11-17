import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ɵInternalFormsSharedModule } from '@angular/forms';
import { FormBuilder ,Validators} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InscripcionesService } from '../../Services/inscripciones.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../Services/language.service';
import { formatDop } from '../../utils/currency';
@Component({
  selector: 'app-inscripcion',
  standalone: true,
  imports: [ReactiveFormsModule, ɵInternalFormsSharedModule, TranslateModule],
  templateUrl: './inscripcion.component.html',
  styleUrl: './inscripcion.component.css'
})
export class InscripcionComponent implements OnInit {

 MetodoForm!:FormGroup
 @Input() monto:number=0;
 @Input() Horario:string='';
 pagoExitoso: boolean = false;
 errorEnPago: boolean = false;
  constructor(
  private fb: FormBuilder,
 private router: Router,
private _inscripcionService: InscripcionesService,
private readonly language: LanguageService) {

   }
   ngOnInit(): void {
    this.MetodoForm = this.fb.group({
      Monto: [this.monto, [Validators.required, Validators.min(0)]],
      Metodo_Pago: ['', Validators.required],
    })
   }
  pagar(): void {
     if (this.MetodoForm.invalid) {
    this.MetodoForm.markAllAsTouched();
    return;
  }

  const inscripcion = {
    ID_Horario: Number(this.Horario),
    Metodo_Pago: this.MetodoForm.value.Metodo_Pago,
    Monto: this.MetodoForm.value.Monto,
    Estado: 'Realizado' // o el valor que uses en tu modelo Pago
  }; 
  
  this._inscripcionService.inscribirUsuario(inscripcion).subscribe({
    next: (response) => {
      console.log('Inscripción exitosa:', response);
      this.pagoExitoso = true;
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);
    },
    error: (error) => {
      console.error('Error al inscribir usuario:', error);
      this.pagoExitoso = false;
      this.errorEnPago = true;
    }

   
  });
}

  formatearMonto(monto: number): string {
    return formatDop(monto, this.language.currentLanguage);
  }
}
