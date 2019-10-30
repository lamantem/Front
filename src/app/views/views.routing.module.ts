import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { LayoutComponent } from "../shared/layout";
import { ReloadGroupsComponent } from "../shared/reload-groups/reload-groups.component";
import { AuthenticationGuard } from "../core/authentication";

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
    component: ReloadGroupsComponent,
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
