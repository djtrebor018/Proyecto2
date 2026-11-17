import { Component,inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServicesService } from '../../Services/auth-services.service';
import { PagosService } from '../../Services/pagos.service';
import { ReactiveFormsModule } from '@angular/forms';   // 1. el import arriba
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../Services/language.service';
import { formatDop } from '../../utils/currency';

@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.css'
})
export class FacturacionComponent implements OnInit {
   MetodoForm!: FormGroup;
    monto: number = 0;
    loading: boolean = true;
    tipo_Usuario: string = '';
    errorMsg: string = '';
    pagoExitoso: boolean = false;
   constructor(
     private fb: FormBuilder,
    private router: Router,
    private _api :AuthServicesService,
    private _Pago:PagosService,
    private readonly language: LanguageService
) {
    
  }
  ngOnInit(): void {
    this.MetodoForm = this.fb.group({
      Monto: [0, [Validators.required, Validators.min(1)]],
      Metodo_Pago: ['', Validators.required],
    });

    this._api.cargarDatos().subscribe({
      next: (response: any) => {
        console.log('Datos del usuario cargados:', response);
        this.tipo_Usuario = response.dataUser.Tipo_Usuario;
        console.log('Tipo de usuario:', this.tipo_Usuario);
        this.monto = this.calcularMonto(this.tipo_Usuario);
        this.MetodoForm.patchValue({ Monto: this.monto });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar los datos del usuario:', error);
        this.errorMsg = 'ERRORS.USER_DATA_LOAD';
        this.loading = false;
      }
    });
  }
  private calcularMonto(tipo: string): number {
    const t = (tipo || '').trim().toLowerCase();
    return t === 'estudiante' ? 800 : 1500; // externo, maestro y cualquier otro
  }

  formatearMonto(monto: number): string {
    return formatDop(monto, this.language.currentLanguage);
  }
  
  invalido(campo: string): boolean {
    const c = this.MetodoForm.get(campo);
    return !!c && c.invalid && (c.touched || c.dirty);
  }
  pagarMensualidad() {
     if (this.MetodoForm.invalid) {
      this.MetodoForm.markAllAsTouched();
      return;
    }
   this.loading = true;
  this.errorMsg = '';
    const pagoData = {
      Metodo_Pago: this.MetodoForm.value.Metodo_Pago,
      Monto: this.MetodoForm.value.Monto
    };
    this._Pago.realizarPago(pagoData).subscribe({
    next: (resp: any) => {
      
  
      this.loading = false;
      setTimeout(() => this.router.navigate(['/dashboard']), 2000);
    },
    error:(err: any) => {
    
      this.errorMsg = err.error?.msg ?? 'ERRORS.PAYMENT';
      this.loading = false;
    }
  });
  }
  }
