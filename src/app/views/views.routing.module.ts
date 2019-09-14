import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { LayoutComponent } from "../shared/layout";

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
