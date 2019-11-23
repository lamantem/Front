import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { debounceTime } from "rxjs/operators";
import { DashboardReportService } from "./dashboard-report.service";
import { LayoutComponent } from "../../../shared/layout";
import { LocalStorageService } from "../../../core/services";
import ReportSync = DashboardModel.ReportSync;

import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard-report',
  templateUrl: './dashboard-report.component.html',
  styleUrls: ['./dashboard-report.component.scss']
})
export class DashboardReportComponent implements OnInit {
  displayedColumns: string[] = ['created_at','added','reject'];
  dataSourceReport: DashboardModel.ReportSync[] = [];
  name: any;
  user: any;

  constructor(
    public dialogRef: MatDialogRef<LayoutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReportSync,
    public localStorage: LocalStorageService,
    private dashboardReportService: DashboardReportService,
    private route: ActivatedRoute
  ) {

  };

  ngOnInit() {
    this.loadReportSync();
  }

  loadReportSync() {
    this.user = JSON.parse(localStorage['appUser']);
    let concurso_id = JSON.parse(localStorage['group_id']);
    let groups_ = JSON.parse(localStorage['groups_']);
      let moderador = _.filter(groups_[0].moderators, {
      'user_id': parseInt(this.user.id)
    });

    if (!concurso_id) {
      let dataSourceReport = [];
      for (let key=0; key < groups_.length; key++) {
        this.dashboardReportService.prepareReportSyncUrl(groups_[key].id);
        this.dashboardReportService.getAll()
          .pipe()
          .subscribe(
            (response) => {
              if (response.status === 200) {
                for (let i=0; i < response.data.length; i++) {
                  dataSourceReport.push(response.data[i]);
                }

                if (key === (groups_.length -1)) {
                    this.dataSourceReport = dataSourceReport;
                }
              }
            },
            error => {
              console.warn(error.toString())
            }
          );
      }
    }

    if (concurso_id) {
      this.dashboardReportService.prepareReportSyncUrl(concurso_id);
      this.dashboardReportService.getAll()
        .pipe(debounceTime(300))
        .subscribe(
          (response) => {
            if (response.status === 200) {
              this.dataSourceReport = (response.data);
            }
          },
          error => {
            console.warn(error.toString())
          }
        );
    }
  }
}
