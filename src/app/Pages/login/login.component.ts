import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServicesService } from '../../Services/auth-services.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
mostrarPassword: boolean = false;

loginForm: FormGroup;

errorMessage: string = '';

constructor(
  private FB:FormBuilder,
  private api: AuthServicesService,
  private _router:Router
){
 this.loginForm = this.FB.group({
  Correo: ['',[Validators.required,Validators.email]],
  Password: ['',[Validators.required]]
 })
}

onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.api.login(this.loginForm.value).subscribe({
      next:(response)=>{
        this._router.navigate(['/dashboard'])
      },
      error: (err) => {
    
       
       this.errorMessage = err.error?.msg || 'Ocurrió un error al iniciar sesión.';
       console.error('Login error:', err.error.msg);
    
  }
      
    })
  }



}
