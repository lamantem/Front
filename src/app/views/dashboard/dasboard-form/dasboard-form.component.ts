import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TranslateService } from "@ngx-translate/core";
import { MatPaginator } from "@angular/material/paginator";
import { BarecodeScannerLivestreamComponent } from "ngx-barcode-scanner";
import { ActivatedRoute } from "@angular/router";
import { debounceTime } from "rxjs/operators";
import { LocalStorageService } from "../../../core/services";
import { DashboardFormService } from "./dashboard-form.service";

@Component({
  selector: 'app-dasboard-form',
  templateUrl: './dasboard-form.component.html',
  styleUrls: ['./dasboard-form.component.scss'],
  preserveWhitespaces: false
})
export class DasboardFormComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(BarecodeScannerLivestreamComponent, {static: true}) barecodeScanner: BarecodeScannerLivestreamComponent;

  protocolReaderDataSource: DashboardModel.ProtocolReader[] = [];
  displayedColumns: string[] = ['participant_name', 'actions'];

  loading: boolean;

  barcodeValue;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private adapter: DateAdapter<any>,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private localStorage: LocalStorageService,
    private dashboardFormService: DashboardFormService,
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
    this.barecodeScanner.start();
  }

  onValueChanges(result){
    this.barcodeValue = result.codeResult.code;
    console.log(result,this.barcodeValue);
  }

  private getProtocolReader(): void {
    this.loading = true;

    let group_id = this.route.snapshot.paramMap.get('group_id');
    this.dashboardFormService.getProtocolReaderUrl(group_id);
    this.dashboardFormService.getAll()
      .pipe(debounceTime(300))
      .subscribe(
        (response) => {
          this.protocolReaderDataSource = response.data;
          this.localStorage.setItem('protocols', JSON.stringify(response.data));
          this.loading = false;
        },
        error => {
          this.loading = false;
          console.warn(error.toString())
        }
      );
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
