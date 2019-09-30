import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { BreakpointObserver } from '@angular/cdk/layout';
import { DateAdapter } from '@angular/material';
import { DashboardReaderComponent } from "../dashboard-reader/dashboard-reader.component";
import { LocalStorageService } from "../../../core/services";
import { DashboardFormService } from "./dashboard-form.service";
import { TranslateService } from "@ngx-translate/core";
import * as _ from 'lodash';

@Component({
  selector: 'app-dasboard-form',
  templateUrl: './dashboard-form.component.html',
  styleUrls: ['./dashboard-form.component.scss'],
  preserveWhitespaces: false
})
export class DashboardFormComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['registration_code', 'participant_name', 'actions'];
  loading: boolean;

  synchronized: boolean;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private adapter: DateAdapter<any>,
    public translate: TranslateService,
    private localStorage: LocalStorageService,
    private dashboardFormService: DashboardFormService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.adapter.setLocale('pt-PT');
    translate.setDefaultLang('pt-br');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|pt-br/) ? browserLang : 'pt-br');
  }

  ngOnInit() {
    this.loading = false;
    this.getProtocolReader();
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      return data.participant_name.toLowerCase().includes(filter)
          || data.period.toLowerCase().includes(filter)
          || data.registration_code.toString() === filter;
    }
  }

  ngAfterViewInit() {
  }

  openReader() {
    const dialogRef = this.dialog.open(DashboardReaderComponent, {
      width: '80%',
      data: {
        group_id: this.route.snapshot.paramMap.get('group_id')
      }});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.synchronized = false;
        this.localStorage.setItem('synchronized', JSON.stringify(this.synchronized));
        this.getProtocolReader();
      }
    });
  }

  removeProtocol(cod) {
    let protocols = JSON.parse(localStorage['protocols']);

    _.remove(protocols, {'id': parseInt(cod)});

    localStorage.setItem('protocols', JSON.stringify(protocols));

    this.getProtocolReader();
  }

  private getProtocolReader(): void {
    let protocolReaderDataSource = JSON.parse(localStorage['protocols']);

    let group_id = this.route.snapshot.paramMap.get('group_id');

    protocolReaderDataSource = _.filter(protocolReaderDataSource, {'group_reader_id': parseInt(group_id)});
    this.dataSource = new MatTableDataSource(protocolReaderDataSource);
  }

  translateMatPaginator() {
    this.translate.get([
      'COMPONENT.PAGINATOR.ITEMS_PER_PAGE',
      'COMPONENT.PAGINATOR.NEXT_PAGE',
      'COMPONENT.PAGINATOR.PREVIOUS_PAGE',
    ])
      .subscribe(translation => {
        this.paginator._intl.itemsPerPageLabel = translation['COMPONENT.PAGINATOR.ITEMS_PER_PAGE'];
        this.paginator._intl.nextPageLabel     = translation['COMPONENT.PAGINATOR.NEXT_PAGE'];
        this.paginator._intl.previousPageLabel = translation['COMPONENT.PAGINATOR.PREVIOUS_PAGE'];
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
