import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login';
import {LogoutComponent} from './logout';
import {LayoutComponent} from '../shared/layout';
import {AuthenticationGuard} from '../core/authentication';

const viewsRoutes: Routes = [
  {
    path: 'acesso',
    component: LoginComponent
  },
  {
    path: 'sair',
    component: LogoutComponent
  },
  {
    path: 'recarregar',
    canActivate: [AuthenticationGuard]
  },
  {
    path: '',
    loadChildren: './dashboard/dashboard.module#DashboardModule',
    component: LayoutComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(viewsRoutes)],
  exports: [RouterModule]
})
export class ViewsRoutingModule {}
