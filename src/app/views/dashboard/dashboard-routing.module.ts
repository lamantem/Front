import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from './dashboard.component';
import {DashboardCreateComponent} from './dashboard-create/dashboard-create.component';
import {DashboardGenerateComponent} from './dashboard-generate/dashboard-generate.component';
import {DashboardAdmComponent} from './dashboard-adm/dashboard-adm.component';
import {DashboardRateComponent} from './dashboard-rate/dashboard-rate.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
  },
  {
    path: 'criar',
    component: DashboardCreateComponent,
    data: {
      title: 'Criar Questão'
    },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      title: 'Home'
    },
  },
  {
    path: 'gerar',
    component: DashboardGenerateComponent,
    data: {
      title: 'Gerar Provas'
    },
  },
  {
    path: 'administrar',
    component: DashboardAdmComponent,
    data: {
      title: 'Administrador'
    },
  },
  {
    path: 'avaliar',
    component: DashboardRateComponent,
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
