import { Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { RegisroComponent } from './Pages/regisro/regisro.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { HorariosComponent } from './Pages/horarios/horarios.component';
import { PagosComponent } from './Pages/pagos/pagos.component';
import { ContratosComponent } from './Pages/contratos/contratos.component';

export const routes: Routes = [
{ path: '', component: LoginComponent },
{ path: 'registro', component: RegisroComponent },
{ path: 'dashboard', component: DashboardComponent },
{ path: 'horario', component: HorariosComponent },
{ path: 'pagos', component: PagosComponent },
{ path: 'contrato', component: ContratosComponent },
{ path: '**', redirectTo: '' }

];
