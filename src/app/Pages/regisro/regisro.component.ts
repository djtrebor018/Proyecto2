import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AuthServicesService } from '../../Services/auth-services.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-regisro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './regisro.component.html',
  styleUrl: './regisro.component.css'
})
export class RegisroComponent {
 registroForm:FormGroup
   mostrarPassword = false;
  errorMessage: string = '';


   constructor(
    private fb: FormBuilder,
    private api: AuthServicesService,
    private _router: Router
   ){
   this.registroForm = this.fb.group({
     Nombre: ['', Validators.required],
      Correo: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      Tipo_Usuario: ['', Validators.required],
      Matricula: [''],
      Cedula: [''],
   })
   } 
   onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      
    }
     const datos = { ...this.registroForm.value };
    datos.Matricula = datos.Matricula?.trim() || null;
    datos.Cedula = datos.Cedula?.trim() || null;

     this.api.registro(this.registroForm.value).subscribe({
      next: (response:any)=>{
        this._router.navigate(['/horario'])
      },
      error:(err)=>{
      const listaErrores = err.error?.errors;
      this.errorMessage = listaErrores?.length
        ? listaErrores.map((error: { msg: string }) => error.msg).join(' | ')
        : 'ERRORS.REGISTRATION';
  console.error('Registro error:', err.error);
      }
     })

  }
}
