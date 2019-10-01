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
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-dashboard-form',
  templateUrl: './dashboard-form.component.html',
  styleUrls: ['./dashboard-form.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  preserveWhitespaces: false
})
export class DashboardFormComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  dataSourceMissing: any;
  dataSourceSearch: any;
  displayedColumnsMissing: string[] = ['registration_code', 'participant_name', 'actions'];
  displayedColumnsSearch: string[] = ['registration_code', 'name'];
  ColumnNames: string[] = ['Cód.', 'Nome'];
  groupsReaderDataSource: DashboardModel.GroupsReader[] = [];
  expandedElement: DashboardModel.GroupsReader[] | null;

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
    this.dataSourceMissing.filterPredicate = function(data, filter: string): boolean {
      return data.participant_name.toLowerCase().includes(filter)
          || data.period.toLowerCase().includes(filter)
          || data.registration_code.toString() === filter;
    };
    this.getGroupReader();
    this.dataSourceSearch.filterPredicate = function(data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter)
          || data.period.toLowerCase().includes(filter)
          || data.registration_code.toString() === filter;
    };
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
    this.dataSourceMissing = new MatTableDataSource(protocolReaderDataSource);
  }

  private getGroupReader(): void {
    let groups = localStorage.getItem('groups');
    let group_id = this.route.snapshot.paramMap.get('group_id');

    this.groupsReaderDataSource = JSON.parse(groups);
    this.groupsReaderDataSource = _.filter(this.groupsReaderDataSource, {'id': parseInt(group_id)});

    let participants = [];
    this.groupsReaderDataSource.forEach(function (group) {
      group.participants.forEach(function (participant) {
        let participant_local = {
          name:               participant.name,
          registration_code:  participant.registration_code,
          allocation_code:    participant.allocation_code,
          period:             participant.period
        };
        participants.push(participant_local);
      })
    });

    this.dataSourceSearch = new MatTableDataSource(participants);
  }

  applyFilterMissing(filterValue: string) {
    this.dataSourceMissing.filter = filterValue.trim().toLowerCase();
  }

  applyFilterSearch(filterValue: string) {
    this.dataSourceSearch.filter = filterValue.trim().toLowerCase();
  }

  collapseAllocation() {
    this.expandedElement = [];
  }


}
