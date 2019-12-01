import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from './dashboard.component';
import {DashboardCreateComponent} from './dashboard-create/dashboard-create.component';
import {DashboardGenerateComponent} from './dashboard-generate/dashboard-generate.component';
import {DashboardAdmComponent} from './dashboard-adm/dashboard-adm.component';
import {DashboardRateComponent} from './dashboard-rate/dashboard-rate.component';
import {AuthenticationGuard} from '../../core/authentication';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'criar',
    component: DashboardCreateComponent,
    canActivate: [AuthenticationGuard],
    data: {
      title: 'Criar Questão'
    },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthenticationGuard],
    data: {
      title: 'Home'
    },
  },
  {
    path: 'gerar',
    component: DashboardGenerateComponent,
    canActivate: [AuthenticationGuard],
    data: {
      title: 'Gerar Provas'
    },
  },
  {
    path: 'administrar',
    component: DashboardAdmComponent,
    canActivate: [AuthenticationGuard],
    data: {
      title: 'Administrador'
    },
  },
  {
    path: 'avaliar',
    component: DashboardRateComponent,
    canActivate: [AuthenticationGuard],
    data: {
      title: 'Avaliar Questões'
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
