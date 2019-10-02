import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatPaginator } from "@angular/material/paginator";
import { ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from "@angular/material/dialog";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TranslateService } from "@ngx-translate/core";
import { LocalStorageService } from "../../../core/services";
import { DashboardFormService } from "./dashboard-form.service";
import { DashboardReaderComponent } from "../dashboard-reader/dashboard-reader.component";

import Swal from 'sweetalert2';
import * as _ from 'lodash';

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

  displayedColumnsMissing: string[] = ['registration_code', 'participant_name', 'actions'];
  displayedColumnsSearch: string[] = ['registration_code', 'name'];
  ColumnNames: string[] = ['Cód.', 'Nome'];

  protocolReaderDataSource: DashboardModel.ProtocolReader[] = [];
  groupsReader: DashboardModel.GroupsReader[] = [];
  expandedElement: DashboardModel.GroupsReader[] | null;

  dataSourceMissing: any;
  loading: boolean;
  synchronized: boolean;
  name : string = '';
  registration_code : string = '';

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
  }

  ngAfterViewInit() {
  }

  openReader() {
    const dialogRef = this.dialog.open(DashboardReaderComponent, {
      panelClass: 'dialog',
      maxWidth: '100vw',
      maxHeight: '100vh',
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
    let protocol = _.filter(protocols, {'registration_code': parseInt(cod)});

    Swal.fire({
      title: 'Você tem certeza que quer deletar o '+ protocol[0].participant_name +'?',
      text: "Você não consegue reverter essa ação depois!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, pode deletar!'
    }).then((result) => {
      if (result.value) {

        if (protocol[0].id === null) {
          _.remove(protocols, {'registration_code': parseInt(cod)});
        }

        if (protocol[0].id != null) {
          _.remove(protocols, {'registration_code': parseInt(cod)});
          protocol[0].active = 0;
          let newProtocol = _.concat(protocols, protocol);
          localStorage.setItem('protocols', JSON.stringify(newProtocol));
          this.getProtocolReader();
          Swal.fire(
            'Deletado!',
            'Candidato deletado com sucesso.',
            'success'
          );
          this.synchronized = false;
          this.localStorage.setItem('synchronized', JSON.stringify(this.synchronized));
          return;
        }

        localStorage.setItem('protocols', JSON.stringify(protocols));
        this.synchronized = false;
        this.localStorage.setItem('synchronized', JSON.stringify(this.synchronized));

        Swal.fire(
          'Deletado!',
          'Candidato deletado com sucesso.',
          'success'
        );

        this.getProtocolReader();
      }
      if (_.isEmpty(protocols)){
        this.synchronized = true;
        this.localStorage.setItem('synchronized', JSON.stringify(this.synchronized));
      }
    });
  }

  private getProtocolReader(): void {
    let protocolReaderDataSource = JSON.parse(localStorage['protocols']);
    let group = JSON.parse(localStorage['groups']);

    let group_id = this.route.snapshot.paramMap.get('group_id');

    this.groupsReader = _.filter(group,
      {'id': parseInt(group_id)});

    protocolReaderDataSource = _.filter(protocolReaderDataSource,
        {'group_reader_id': parseInt(group_id),'active': 1});
    this.dataSourceMissing = new MatTableDataSource(protocolReaderDataSource);
  }

  public loadGroupReader(): void {
    let groups = localStorage.getItem('groups');
    let group = JSON.parse(groups);

    let group_id = this.route.snapshot.paramMap.get('group_id');

    this.groupsReader = _.filter(group, {'id': parseInt(group_id)});

    if (this.registration_code != '' && this.name === '') {
      this.protocolReaderDataSource = _.filter(this.groupsReader[0].participants, {
        'registration_code': parseInt(this.registration_code),
      });
      return;
    }

    if (this.name != '' && this.registration_code === '') {
      this.protocolReaderDataSource = _.filter(this.groupsReader[0].participants, {
        'name': this.name.toLocaleUpperCase(),
      });
      return;
    }

    this.protocolReaderDataSource = _.filter(this.groupsReader[0].participants, {
      'registration_code': parseInt(this.registration_code),
      'name': this.name.toLocaleUpperCase()
    });
  }

  applyFilterMissing(filterValue: string) : void {
    this.dataSourceMissing.filter = filterValue.trim().toLowerCase();
  }

}
