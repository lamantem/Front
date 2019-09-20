import { NgModule} from "@angular/core";
import { RouterModule, Routes} from "@angular/router";
import { AuthenticationGuard } from "../../core/authentication";
import { DashboardListComponent } from "./dashboard-list/dashboard-list.component";
import { DasboardFormComponent } from "./dasboard-form/dasboard-form.component";

const dashboardRoutes: Routes = [
  {
    path: 'concurso/:group_id',
    component: DasboardFormComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: '',
    component: DashboardListComponent,
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(dashboardRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class DashboardRoutingModule {}
