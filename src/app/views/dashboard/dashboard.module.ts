import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardListComponent } from "./dashboard-list/dashboard-list.component";
import { DasboardFormComponent } from "./dasboard-form/dasboard-form.component";
import { DashboardRoutingModule } from "./dashboard.routing.module";
import { AppMaterialModule } from "../../app.material.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { HttpLoaderFactory } from "../views.module";
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    DashboardRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrMaskerModule
  ],
  declarations: [
    DashboardListComponent,
    DasboardFormComponent
  ]
})
export class DashboardModule {}
