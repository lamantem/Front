import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Observable, of, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { LocalStorageService } from "../../../core/services";
import { LZStringService } from "ng-lz-string";
import { BarcodeFormat } from '@zxing/library';

import Swal from 'sweetalert2';
import * as _ from 'lodash';
import * as moment from "moment";
import { BarecodeScannerLivestreamComponent } from "ngx-barcode-scanner";

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

  synchronized: boolean;
  newProtocol: object;
  spinner: boolean;
  input_code:string;
  show: boolean;
  reader: boolean;
  message: string;
  loading: boolean;
  toggle: boolean;
  barcodeValue;

  code = new Subject<any>();

  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;
  hasDevices: boolean;

  torchEnabled = false;
  tryHarder = false;

  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.CODE_39,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];

  constructor(
    private route: ActivatedRoute,
    private localStorage: LocalStorageService,
    private lz: LZStringService,
  @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.loading = false;
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

  onToggleChange() {
    if (this.toggle) {
      this.barecodeScanner.start();
    }

    if (!this.toggle) {
      this.barecodeScanner.stop();

      this.onCamerasFound(this.availableDevices)
    }
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onValueChanges(result){
    this.barcodeValue = result.codeResult.code;
    this.loading = true;

    if (this.barcodeValue.indexOf('-') >= 0) {
      let code = this.barcodeValue.split('-');
      this.barcodeValue = parseInt(code[1]);
    }

    this.rawSearchByCode(parseInt(this.barcodeValue));
  }

  onCodeResult(resultString: string) {
    this.barcodeValue = resultString;
    this.loading = true;

    if (this.barcodeValue.indexOf('-') >= 0) {
      let code = this.barcodeValue.split('-');
      this.barcodeValue = parseInt(code[1]);
    }

    if (!this.show) {
      this.rawSearchByCode(parseInt(this.barcodeValue));
    }
  }

  doSearchbyCode(codes: Observable<any>) {
    return codes
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        switchMap(code => this.rawSearchByCode(code)),
      );
  }

  rawSearchByCode(code): Observable<any> {
    this.show = true;
    this.groupsReader = JSON.parse(
      this.lz.decompress(
        localStorage.getItem('groups')
      )
    );

    let protocol = localStorage.getItem('protocols');
    this.protocolReader = JSON.parse(protocol);

    let user = localStorage.getItem('appUser');
    user = JSON.parse(user);

    let group_id     = this.data.group_id;
    let participants = [];
    let mod          = [];

    this.groupsReader.forEach(function (group) {
      if (parseInt(group.id) === parseInt(group_id)) {
        participants = _.filter(group.participants, {
          'registration_code': parseInt(code)
        });
        mod = _.filter(group.moderators, {
          'user_id': user['id']
        });
      }
    });

    this.resetNewParticipant();

    if (participants.length > 0) {

      let participantsExist = _.filter(this.protocolReader,
        {'registration_code': parseInt(code), 'active': 1});

      if (!_.isEmpty(participantsExist)) {
        Swal.fire('Ops!', 'Candidato já foi registrado!', 'error');
        debounceTime(800);
        return of('O candidato já foi registrado!');
      }

      this.newProtocol = {
        'id': null,
        'participant_id': participants[0].id,
        'categories_id': participants[0].categories_id,
        'moderator_id': mod[0].id,
        'group_reader_id': parseInt(this.data.group_id),
        'participant_name': participants[0].name,
        'registration_code': participants[0].registration_code,
        'protocol_type': 'falta',
        'period': participants[0].period,
        'date_reader': moment().format('YYYY-MM-DD h:mm:ss'),
        'active': 1,
        'sync': 0
      };

      this.newParticipant['participant_name']  = participants[0].name;
      this.newParticipant['registration_code'] = participants[0].registration_code;
      this.show = true;
      this.loading = false;
      this.barecodeScanner.stop();

      return of('Candidato encontrado!');
    }

    this.show = false;
    this.loading = false;
    return of('Código de inscrição inválido!');
  }

  saveProtocol() {
    if (this.newProtocol != null) {
      this.protocolReader.push(<DashboardModel.ProtocolReader>this.newProtocol);
      this.localStorage.setItem('protocols', JSON.stringify(this.protocolReader));
      this.synchronized = false;
      this.localStorage.setItem('synchronized', JSON.stringify(this.synchronized));
      this.resetNewParticipant();
      this.input_code = '';
      this.newProtocol = null;
      this.show = false;
      this.message = 'Candidato registrado com sucesso';
      this.barecodeScanner.start();
    }
  }

  resetNewParticipant() : void {
    this.show = false;
    this.newParticipant = [];
    this.message = '';
  }
}
