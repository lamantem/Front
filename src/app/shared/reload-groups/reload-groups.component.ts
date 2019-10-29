import { Component, OnInit } from '@angular/core';
import {DashboardListService} from "../../views/dashboard/dashboard-list/dashboard-list.service";
import {LZStringService} from "ng-lz-string";
import {DateAdapter} from "@angular/material/core";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {LocalStorageService} from "../../core/services";

@Component({
  selector: 'app-reload-groups',
  templateUrl: './reload-groups.component.html',
  styleUrls: ['./reload-groups.component.scss']
})
export class ReloadGroupsComponent implements OnInit {
  private loading: boolean;
  private synchronized: boolean;
  private submitted: boolean;
  groupsReaderDataSource: DashboardModel.GroupsReader[] = [];

  constructor(
      public translate: TranslateService,
      private router: Router,
      public localStorage: LocalStorageService,
      private dashboardListService: DashboardListService,
      private adapter: DateAdapter<any>,
      private lz: LZStringService
  ) {
    this.adapter.setLocale('pt-PT');
    translate.setDefaultLang('pt-br');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|pt-br/) ? browserLang : 'pt-br');
  }

  ngOnInit() {
    console.log('olá');
    this.prepareGroupReader();
  }

  private prepareGroupReader() {
    this.loading = true;
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


  public getGroupReader(): void {
    this.groupsReaderDataSource = JSON.parse(
        this.lz.decompress(
            localStorage.getItem('groups')
        )
    )
  }

}
