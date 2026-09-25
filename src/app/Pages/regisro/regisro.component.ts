import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AuthServicesService } from '../../Services/auth-services.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-regisro',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
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
      Cedula: ['',],
   })
   } 
   onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }
     this.api.registro(this.registroForm.value).subscribe({
      next: (response:any)=>{
        this._router.navigate(['/dashboard'])
      },
      error:(err)=>{
      this.errorMessage = err.error?.msg || 'Ocurrió un error al iniciar sesión.';
       console.error('Login error:', err.error.msg);
      }
     })

  }
}
