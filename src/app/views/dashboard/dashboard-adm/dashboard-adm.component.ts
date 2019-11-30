import { AfterViewInit, OnInit, Component } from '@angular/core';

@Component({
  selector: 'dashboard-adm',
  templateUrl: './dashboard-adm.component.html',
  styleUrls: ['./dashboard-adm.component.scss'],
})
export class DashboardAdmComponent implements OnInit, AfterViewInit {
  createuser_email: any;
  createuser_password: any;
  createuser_type: any;
  constructor(
    ) {
    }

  ngOnInit() {

  }

  ngAfterViewInit() {
  }
  createuser() {
    // tem que criar um PERFIL, pois sem um perfilID não existirá user
    return;
  }
}
