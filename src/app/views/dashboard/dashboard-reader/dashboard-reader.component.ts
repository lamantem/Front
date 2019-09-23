import { Component, OnInit, ViewChild } from '@angular/core';
import { BarecodeScannerLivestreamComponent } from "ngx-barcode-scanner";
import { Observable, of, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { ActivatedRoute } from "@angular/router";
import { LocalStorageService } from "../../../core/services";

@Component({
  selector: 'app-dashboard-reader',
  templateUrl: './dashboard-reader.component.html',
  styleUrls: ['./dashboard-reader.component.scss']
})
export class DashboardReaderComponent implements OnInit {

  @ViewChild(BarecodeScannerLivestreamComponent, {static: true}) barecodeScanner: BarecodeScannerLivestreamComponent;

  groupsReader: DashboardModel.GroupsReader[] = [];
  protocolReader: DashboardModel.ProtocolReader[] = [];

  spinner: boolean;
  message: string;
  barcodeValue;

  code$ = new Subject<any>();

  constructor(
    private route: ActivatedRoute,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit() {
      this.doSearchbyCode(this.code$)
      .subscribe(
        res => {
          this.spinner = false;
          this.message = res;
        },
        err => {
          this.spinner = false;
          this.message = `An Error! ${err.json().error}`;
        },
      );
  }

  onChange() {
    this.spinner = true;
  }

  doSearchbyCode(codes: Observable<any>) {
    return codes
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(code => this.rawSearchByCode(code)),
      );
  }

  rawSearchByCode(code): Observable<any> {
    let group = localStorage.getItem('groups');
    this.groupsReader = JSON.parse(group);
    let protocol = localStorage.getItem('protocols');
    this.protocolReader = JSON.parse(protocol);
    let user = localStorage.getItem('appUser');
    user = JSON.parse(user);
    let group_id = this.route.snapshot.paramMap.get('group_id');

    let groups = _.filter(this.groupsReader, {'id': 1});
    let participants = _.filter(groups[0].participants, {'registration_code': parseInt(code)});

    if (participants.length > 0) {
      Swal.fire('Candidato: ' + participants[0].name,
        'codigo inscricao: ' + participants[0].registration_code,
      );
      this.protocolReader.push(participants[0]);
      this.localStorage.setItem('protocols', JSON.stringify(this.protocolReader));
      return of('Participante encontrado!' + participants[0].name);
    }

    return of('O codigo de inscrição está invalido!');
  }

  ngAfterViewInit() {
    this.barecodeScanner.start();
  }

  onValueChanges(result){
    this.barcodeValue = result.codeResult.code;
    console.log(result,this.barcodeValue);
  }

}
