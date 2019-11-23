import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { ZXingScannerModule } from "@zxing/ngx-scanner";
import { LZStringModule, LZStringService } from "ng-lz-string";
import { BarecodeScannerLivestreamModule } from "ngx-barcode-scanner";
import { DashboardListComponent } from "./dashboard-list/dashboard-list.component";
import { DashboardFormComponent } from "./dashboard-form/dashboard-form.component";
import { DashboardRoutingModule } from "./dashboard.routing.module";
import { AppMaterialModule } from "../../app.material.module";
import { HttpLoaderFactory } from "../views.module";
import { DashboardReaderComponent } from './dashboard-reader/dashboard-reader.component';
import { FilterPipe } from "../../shared/filter/filter.pipe";
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    DashboardRoutingModule,
    LZStringModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrMaskerModule,
    ZXingScannerModule,
    BarecodeScannerLivestreamModule
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
