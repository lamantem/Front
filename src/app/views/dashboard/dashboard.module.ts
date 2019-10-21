import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { DashboardListComponent } from "./dashboard-list/dashboard-list.component";
import { DashboardFormComponent } from "./dashboard-form/dashboard-form.component";
import { DashboardRoutingModule } from "./dashboard.routing.module";
import { AppMaterialModule } from "../../app.material.module";
import { HttpLoaderFactory } from "../views.module";
import { BrMaskerModule } from 'br-mask';
import { BarecodeScannerLivestreamModule } from "ngx-barcode-scanner";
import { DashboardReaderComponent } from './dashboard-reader/dashboard-reader.component';
import { FilterPipe } from "../../shared/filter/filter.pipe";
import { LZStringModule, LZStringService } from "ng-lz-string";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    DashboardRoutingModule,
    BarecodeScannerLivestreamModule,
    LZStringModule,
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
    DashboardFormComponent,
    DashboardReaderComponent,
    FilterPipe
  ],
  providers: [
    LZStringService
  ],
  entryComponents: [DashboardReaderComponent]
})
export class DashboardModule {}
