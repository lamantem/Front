import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { DateAdapter, MatPaginator } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { DashboardListService } from "./dashboard-list.service";
import { LocalStorageService } from "../../../core/services";
import { LZStringService } from "ng-lz-string";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'dashboard-list',
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.scss'],
  preserveWhitespaces: false
})
export class DashboardListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  displayedColumns: string[] = ['name','actions'];
  groupsReaderDataSource: DashboardModel.GroupsReader[] = [];
  searchTerm: string;

  submitted: boolean;
  synchronized: boolean;
  loading: boolean;
  filter: any;

  constructor(
      private http: HttpClient,
      public translate: TranslateService,
      public localStorage: LocalStorageService,
      private dashboardListService: DashboardListService,
      private router: Router,
      private adapter: DateAdapter<any>,
      private lz: LZStringService
  ) {
    this.adapter.setLocale('pt-PT');
    translate.setDefaultLang('pt-br');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|pt-br/) ? browserLang : 'pt-br');
  }

  ngOnInit() {
    this.loading = true;
    this.prepareGroupReader();
    // this.translateMatPaginator();
  }

  ngAfterViewInit() {
  }

  private prepareGroupReader() {
    this.dashboardListService.getGroupReaderUrl();
    this.dashboardListService.getAll()
        .pipe()
        .subscribe(
            (response) => {
              if (response.status === 200) {
                let groups = response.data;
                this.localStorage.setItem('groups', this.lz.compress(JSON.stringify(groups)));
                this.getGroupReader();
                this.loading = false;
                let protocols = [];
                groups.forEach(function (group) {
                  group.protocols.forEach(function (protocol) {
                    let protocol_local = {
                      id:                protocol.id,
                      date_reader:       protocol.date_reader,
                      categories_id:     protocol.categories_id,
                      group_reader_id:   protocol.group_reader_id,
                      moderator_id:      protocol.moderator_id,
                      participant_id:    protocol.participant_id,
                      participant_name:  protocol.participant_name,
                      protocol_type:     protocol.protocol_type,
                      registration_code: protocol.registration_code,
                      period:            protocol.period,
                      active: 1,
                      sync: 1
                    };
                    protocols.push(protocol_local);
                  });
                });
                this.localStorage.setItem('protocols', JSON.stringify(protocols));
                this.synchronized = true;
                this.localStorage.setItem('synchronized', JSON.stringify(this.synchronized));
                this.submitted = false;
              }
              this.router.navigate(['/']);
            },);
  }

  private getGroupReader(): void {
    this.groupsReaderDataSource = JSON.parse(
        this.lz.decompress(
            localStorage.getItem('groups')
        )
    )
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
}
