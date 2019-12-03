import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardAdmComponent } from './dashboard-adm/dashboard-adm.component';
import { DashboardGenerateComponent } from './dashboard-generate/dashboard-generate.component';
import { DashboardCreateComponent } from './dashboard-create/dashboard-create.component';
import { DashboardRateComponent } from './dashboard-rate/dashboard-rate.component';
import {AppMaterialModule} from '../../app.material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {FilterPipe} from '../../shared/filter/filter.pipe';
import {DashboardReviewComponent} from './dashboard-review/dashboard-review.component';

@NgModule({
    imports: [
        DashboardRoutingModule,
        ReactiveFormsModule,
        AppMaterialModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
    ],
  declarations: [
    FilterPipe,
    DashboardComponent,
    DashboardCreateComponent,
    DashboardAdmComponent,
    DashboardGenerateComponent,
    DashboardRateComponent,
    DashboardReviewComponent
  ]
})
export class DashboardModule { }
