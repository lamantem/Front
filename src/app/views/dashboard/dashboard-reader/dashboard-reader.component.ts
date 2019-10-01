import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Observable, of, Subject } from "rxjs";
import { BarecodeScannerLivestreamComponent } from "ngx-barcode-scanner";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { LocalStorageService } from "../../../core/services";

import Swal from 'sweetalert2';
import * as _ from 'lodash';
import * as moment from "moment";

@Component({
  selector: 'app-dashboard-reader',
  templateUrl: './dashboard-reader.component.html',
  styleUrls: ['./dashboard-reader.component.scss']
})
export class DashboardReaderComponent implements OnInit {

  @ViewChild(BarecodeScannerLivestreamComponent, {static: true}) barecodeScanner: BarecodeScannerLivestreamComponent;

  groupsReader: DashboardModel.GroupsReader[] = [];
  protocolReader: DashboardModel.ProtocolReader[] = [];
  newParticipant: DashboardModel.NewParticipant[] = [];

  newProtocol: object;
  spinner: boolean;
  show: boolean;
  reader: boolean;
  message: string;
  barcodeValue;

  code = new Subject<any>();

  constructor(
    private route: ActivatedRoute,
    private localStorage: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.show = false;
    this.reader = true;
    this.doSearchbyCode(this.code)
      .subscribe(
        res => {
          this.spinner = false;
          this.message = res;
        },
        err => {
          this.rawSearchByCode(this.code);
        },
      );
  }

  onChange() {
    this.spinner = true;
    debounceTime(800);
  }

  onValueChanges(result){
    this.barcodeValue = result.codeResult.code;

    if (this.barcodeValue.indexOf('-') >= 0) {
      let code = this.barcodeValue.split('-');
      this.rawSearchByCode(parseInt(code[1]));
      return;
    }

    this.rawSearchByCode(parseInt(this.barcodeValue));
  }

  ngAfterViewInit() {
    this.barecodeScanner.start();
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
    let mod = _.filter(groups[0].moderators, {'user_id': user['id']});

    this.resetNewParticipant();

    if (participants.length > 0) {

      let participantsExist = _.filter(this.protocolReader,
        {'registration_code': parseInt(code), 'active': 1});

      if (!_.isEmpty(participantsExist)) {
        Swal.fire('Ops!', 'Candidato já foi escaneado!', 'error');
        this.barecodeScanner.retart();
        debounceTime(400);
        return of('O candidato já foi escaneado!');
      }

      this.newProtocol = {
        'id': null,
        'participant_id': participants[0].id,
        'moderator_id': mod[0].id,
        'group_reader_id': parseInt(this.data.group_id),
        'participant_name': participants[0].name,
        'registration_code': participants[0].registration_code,
        'protocol_type': 'falta',
        'period': participants[0].period,
        'active': 1,
        'date_reader': moment().format('YYYY-MM-DD h:mm:ss')
      };

      this.barecodeScanner.stop();

      this.newParticipant['participant_name']  = participants[0].name;
      this.newParticipant['registration_code'] = participants[0].registration_code;
      this.show = true;

      return of('Candidato encontrado!');
    }

    return of('O codigo de inscrição está invalido!');
  }

  saveProtocol() {
    if (this.newProtocol != null) {
      this.protocolReader.push(<DashboardModel.ProtocolReader>this.newProtocol);
      this.localStorage.setItem('protocols', JSON.stringify(this.protocolReader));
    }
  }

  resetNewParticipant() {
    this.show = false;
    this.newParticipant = [];
    this.message = '';
    this.barecodeScanner.retart();
  }
}
