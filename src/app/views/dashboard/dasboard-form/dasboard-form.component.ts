import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateService } from "@ngx-translate/core";
import { MatPaginator } from "@angular/material/paginator";
import { ActivatedRoute } from "@angular/router";
import { LocalStorageService } from "../../../core/services";
import { DashboardFormService } from "./dashboard-form.service";
import { MatDialog } from "@angular/material/dialog";
import { DashboardReaderComponent } from "../dashboard-reader/dashboard-reader.component";
import * as _ from 'lodash';

@Component({
  selector: 'app-dasboard-form',
  templateUrl: './dasboard-form.component.html',
  styleUrls: ['./dasboard-form.component.scss'],
  preserveWhitespaces: false
})
export class DasboardFormComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  protocolReader: DashboardModel.ProtocolReader[] = [];
  displayedColumns: string[] = ['registration_code', 'participant_name', 'actions'];

  loading: boolean;
  sincronize: boolean;

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
        this.sincronize = true;
        this.localStorage.setItem('sincronize', JSON.stringify(this.sincronize));
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
    this.protocolReader = JSON.parse(localStorage['protocols']);

    let group_id = this.route.snapshot.paramMap.get('group_id');

    this.protocolReader = _.filter(this.protocolReader, {'group_reader_id': parseInt(group_id)});
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
