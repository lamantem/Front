import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from "@angular/material/dialog";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { LocalStorageService } from "../../../core/services";
import { DashboardFormService } from "./dashboard-form.service";
import { DashboardReaderComponent } from "../dashboard-reader/dashboard-reader.component";
import { LZStringService } from "ng-lz-string";

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class DashboardFormComponent implements OnInit{

  displayedColumnsMissing: string[] = ['sync', 'registration_code', 'participant_name', 'actions'];
  displayedColumnsSearch: string[] = ['registration_code', 'name'];
  ColumnNames: string[] = ['Insc.', 'Nome'];

  groupReaderDataSource: DashboardModel.ProtocolReader[] = [];
  groupsReader: DashboardModel.GroupsReader[] = [];
  expandedElement: DashboardModel.GroupsReader[] | null;

  dataSourceMissing: any;
  loading: boolean;
  loading_search: boolean;
  synchronized: boolean;
  category_id: number = 0;
  searchForm: FormGroup;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private adapter: DateAdapter<any>,
    public translate: TranslateService,
    private localStorage: LocalStorageService,
    private formBuilder: FormBuilder,
    private dashboardFormService: DashboardFormService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private lz: LZStringService
  ) {
    this.adapter.setLocale('pt-PT');
    translate.setDefaultLang('pt-br');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|pt-br/) ? browserLang : 'pt-br');
  }

  ngOnInit() {
    this.localStorage.setItem('group_id',
        JSON.stringify(this.route.snapshot.paramMap.get('group_id'))
    );
    this.getProtocolReader(this.category_id);
    this.searchForm = this.formBuilder.group(
      {
        registration_code: [''],
        name: ['', Validators.minLength(2)],
        category_id: ['']
      });
  }

  openReader(): void {
    this.loading = true;

    const dialogRef = this.dialog.open(
      DashboardReaderComponent,
      {
        disableClose: true,
        panelClass: 'dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data: {
          group_id: this.route.snapshot.paramMap.get('group_id')
        }
       }
      );

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          setTimeout(() => {
            this.loading = false;
          }, 300);
          this.getProtocolReader(this.category_id);
        }
      });
  }

  removeProtocol(cod) {
    let protocols = JSON.parse(localStorage['protocols']);
    let protocol = _.filter(protocols, {'registration_code': parseInt(cod)});

    Swal.fire({
      title: 'Deseja remover: '+ protocol[0].participant_name +'?',
      text: "Esta é uma ação irreversivel!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, pretendo deletar!',
      cancelButtonText: 'Cancelar'
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
          this.getProtocolReader(this.category_id);
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

        this.getProtocolReader(this.category_id);
      }
      if (_.isEmpty(protocols)){
        this.synchronized = true;
        this.localStorage.setItem('synchronized', JSON.stringify(this.synchronized));
      }
    });
  }

  public getProtocolReader(category_id): void {
    this.category_id = category_id;

    let protocolReaderDataSource = JSON.parse(localStorage['protocols']);
    let groups_ = JSON.parse(localStorage.getItem('groups_'));
    let user =  JSON.parse(localStorage.getItem('appUser'));

    let group_id = this.route.snapshot.paramMap.get('group_id');

    let groupsReader = null;
    groups_.forEach(function (group) {
      if (group.id === parseInt(group_id)) {
        groupsReader = group;
      }
    });

    this.groupsReader[0] = groupsReader;

    let mod = _.filter(this.groupsReader[0].moderators, {
      'user_id': user['id']
    });

    if (category_id === 0) {
      protocolReaderDataSource = _.filter(protocolReaderDataSource, {
        'group_reader_id': parseInt(group_id),
        'active': 1,
        'moderator_id': mod[0].id
      });
    }

    if (category_id > 0) {
      protocolReaderDataSource = _.filter(protocolReaderDataSource, {
        'group_reader_id': parseInt(group_id),
        'categories_id': parseInt(category_id),
        'active': 1,
        'moderator_id': mod[0].id
      });
    }

    this.dataSourceMissing = new MatTableDataSource(protocolReaderDataSource);
  }

  public onSubmit() {
     if (this.searchForm.valid) {
       this.loadGroupReader();
     }
  }

  public loadGroupReader(): void {
    this.loading_search = true;

    let participants = [];
    let group = this.prepareGroup();

    let group_id = this.route.snapshot.paramMap.get('group_id');
    let filter_registration_code = parseInt(this.searchForm.get('registration_code').value);
    this.groupsReader = _.filter(group, {'id': parseInt(group_id)});

    if (
      this.category_id === 0 &&
      this.searchForm.get('name').value.trim() !== '' ||
      this.searchForm.get('registration_code').value.trim() !== ''
    ) {
      participants = this.groupsReader[0].participants;
    }

    if (this.category_id > 0) {
      participants = _.filter(this.groupsReader[0].participants, {
        'categories_id': this.category_id
      });
    }

    if (
      this.searchForm.get('registration_code').value.trim() === '' &&
      this.searchForm.get('name').value.trim() === '' &&
      this.category_id > 0
    ) {
      this.groupReaderDataSource = participants;
      this.loading_search = false;
      return;
    }

    if (
      this.searchForm.get('registration_code').value.trim() !== '' &&
      this.searchForm.get('name').value.trim() === ''
    ) {
      let attribs: {};
      attribs = {
        'registration_code': parseInt(this.searchForm.get('registration_code').value)
      };

      this.groupReaderDataSource = _.filter(participants, attribs);
      this.loading_search = false;
      return;
    }

    let filter_name = this.searchForm.get('name').value.trim().toLocaleUpperCase();

    if (
      this.searchForm.get('name').value.trim() !== '' &&
      this.searchForm.get('registration_code').value.trim() === ''
    ) {
      this.groupReaderDataSource = _.filter(participants, function (participant) {
        return participant.name.toLocaleUpperCase().indexOf(filter_name)>-1;
      });
      this.loading_search = false;
      return;
    }

    if (
      this.searchForm.get('name').value.trim() !== '' &&
      this.searchForm.get('registration_code').value.trim() !== ''
    ) {
      this.groupReaderDataSource = _.filter(participants, function (participant) {
        return (
          participant.name.toLocaleUpperCase().indexOf(filter_name)>-1 &&
          participant.registration_code === filter_registration_code
        );
      });
      this.loading_search = false;
      return;
    }

    this.groupReaderDataSource = _.filter(participants, function (participant) {
      return participant.name.toLocaleUpperCase().indexOf(filter_name) > -1 ;
    });
    this.loading_search = false;
  }
  
  applyFilterMissing(filterValue: string) : void {
    this.dataSourceMissing.filter = filterValue.trim().toLowerCase();
  }

  clearLocationValues(){
    this.searchForm.get('name').setValue('');
    this.searchForm.get('registration_code').setValue('');
    this.groupReaderDataSource = [];
    this.searchForm.get('category_id').setValue(0);
  }

  prepareGroup() {
    return JSON.parse(
      this.lz.decompress(
        localStorage.getItem('groups')
      )
    );
  }
}
