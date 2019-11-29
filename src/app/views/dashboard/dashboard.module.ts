import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardAdmComponent } from './dashboard-adm/dashboard-adm.component';
import { DashboardGenerateComponent } from './dashboard-generate/dashboard-generate.component';
import { DashboardCreateComponent } from './dashboard-create/dashboard-create.component';
import { DashboardRateComponent } from './dashboard-rate/dashboard-rate.component';
import {AppMaterialModule} from '../../app.material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    DashboardRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  declarations: [
    DashboardComponent,
    DashboardCreateComponent,
    DashboardAdmComponent,
    DashboardGenerateComponent,
    DashboardRateComponent
  ]
})
export class DashboardModule { }
