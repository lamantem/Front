import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BarecodeScannerLivestreamComponent } from "ngx-barcode-scanner";
import { Observable, of, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { ActivatedRoute } from "@angular/router";
import { LocalStorageService } from "../../../core/services";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

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
    private localStorage: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
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

    let groups = _.filter(this.groupsReader, {'id': parseInt(this.data.group_id)});
    let participants = _.filter(groups[0].participants, {'registration_code': parseInt(code)});

    let new_protocol = {
      'id': participants[0].id,
      'moderator_id': user['id'],
      'group_reader_id': parseInt(this.data.group_id),
      'participant_name': participants[0].name,
      'registration_code': participants[0].registration_code,
      'type': groups[0].type,
      'date_reader': '2019-09-24 00:00:00'
    };

    let participantsExist = _.filter(this.protocolReader, {'registration_code': parseInt(code)});

    if (participants.length > 0) {
      if (!_.isEmpty(participantsExist)) {
        Swal.fire('Ops!', 'Candidato já foi escaneado!', 'error');
        return of('O candidato já foi escaneado!');
      }

      Swal.fire('Candidato: ' + participants[0].name,
        'codigo inscricao: ' + participants[0].registration_code,
      );

      this.protocolReader.push(new_protocol);
      this.localStorage.setItem('protocols', JSON.stringify(this.protocolReader));
      return of('Participante encontrado: ' + participants[0].name);
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
