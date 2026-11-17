import { Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { RegisroComponent } from './Pages/regisro/regisro.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { HorariosComponent } from './Pages/horarios/horarios.component';
import { PagosComponent } from './Pages/pagos/pagos.component';
import { ContratosComponent } from './Pages/contratos/contratos.component';
import { FacturacionComponent } from './Pages/facturacion/facturacion.component';
import { AyudaComponent } from './Pages/ayuda/ayuda.component';
import { AdminLayoutComponent } from './Pages/admin-layout/admin-layout.component';
import { AdminSchedulesComponent } from './Pages/admin-schedules/admin-schedules.component';
import { AdminUsersComponent } from './Pages/admin-users/admin-users.component';
import { AdminEnrollmentsComponent } from './Pages/admin-enrollments/admin-enrollments.component';
import { AdminPaymentsComponent } from './Pages/admin-payments/admin-payments.component';
import { AdminContractsComponent } from './Pages/admin-contracts/admin-contracts.component';
import { AdminBackupComponent } from './Pages/admin-backup/admin-backup.component';

export const routes: Routes = [
{ path: '', component: LoginComponent },
{ path: 'registro', component: RegisroComponent },
{ path: 'dashboard', component: DashboardComponent },
{
  path: 'admin',
  component: AdminLayoutComponent,
  children: [
    { path: '', pathMatch: 'full', redirectTo: 'usuarios' },
    { path: 'usuarios', component: AdminUsersComponent },
    { path: 'inscripciones', component: AdminEnrollmentsComponent },
    { path: 'horarios', component: AdminSchedulesComponent },
    { path: 'pagos', component: AdminPaymentsComponent },
    { path: 'contratos', component: AdminContractsComponent },
    { path: 'backup', component: AdminBackupComponent }
  ]
},
{ path: 'horario', component: HorariosComponent },
{ path: 'pagos/:id', component: PagosComponent },
{ path: 'contrato', component: ContratosComponent },
{ path: 'facturacion', component: FacturacionComponent },
{ path: 'ayuda', component: AyudaComponent },
{ path: '**', redirectTo: '' }

];
