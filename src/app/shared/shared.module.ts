import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { DashboardReportComponent } from "../views/dashboard/dashboard-report/dashboard-report.component";
import { LayoutComponent } from "./layout";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatTableModule,
    MatDialogModule
  ],
  declarations: [
    DashboardReportComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ],
  providers: [
    LayoutComponent
  ],
  entryComponents: [
    DashboardReportComponent
  ]
})
export class SharedModule {}