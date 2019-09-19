import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { DateAdapter, MatPaginator, MatTableDataSource } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { DashboardListService } from "./dashboard-list.service";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: 'dashboard-list',
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.scss'],
  preserveWhitespaces: false
})
export class DashboardListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  displayedColumns: string[] = ['id', 'name','actions'];
  dataSource = new MatTableDataSource<any>();
  groupsReaderDataSource: DashboardModel.GroupsReader[] = [];

  loading: boolean;

  constructor(
    private http: HttpClient,
    public translate: TranslateService,
    private dashboardListService: DashboardListService,
    private router: Router,
    private adapter: DateAdapter<any>
  ) {
    this.adapter.setLocale('pt-PT');
    translate.setDefaultLang('pt-br');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|pt-br/) ? browserLang : 'pt-br');
  }

  ngOnInit() {
    this.getGroupReader();
    // this.translateMatPaginator();
  }

  ngAfterViewInit() {
  }

  private getGroupReader(): void {
      let user = localStorage.getItem('groups');
      this.groupsReaderDataSource = JSON.parse(user)
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
