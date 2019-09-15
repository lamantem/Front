import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TranslateService } from "@ngx-translate/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { BarecodeScannerLivestreamComponent } from "ngx-barcode-scanner";

@Component({
  selector: 'app-dasboard-form',
  templateUrl: './dasboard-form.component.html',
  styleUrls: ['./dasboard-form.component.scss'],
  preserveWhitespaces: false
})
export class DasboardFormComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(BarecodeScannerLivestreamComponent, {static: true}) barecodeScanner: BarecodeScannerLivestreamComponent;

  displayedColumns: string[] = ['id', 'name','actions'];

  dataSource = new MatTableDataSource<any>();

  loading: boolean;

  barcodeValue;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private adapter: DateAdapter<any>,
    public translate: TranslateService,
  ) {
    this.adapter.setLocale('pt-PT');
    translate.setDefaultLang('pt-br');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|pt-br/) ? browserLang : 'pt-br');

  }

  ngOnInit() {
    this.loading = false;
    this.dataSource.data = [
      {id:533,name:'Candidato A'},
      {id:1010,name:'Candidato B'},
      {id:3,name:'Candidato C'}
    ];
  }

  ngAfterViewInit() {
    this.barecodeScanner.start();
  }

  onValueChanges(result){
    this.barcodeValue = result.codeResult.code;
    console.log(result,this.barcodeValue);
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
