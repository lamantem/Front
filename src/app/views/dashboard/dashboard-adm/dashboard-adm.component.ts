import { AfterViewInit, OnInit, Component } from '@angular/core';

@Component({
  selector: 'dashboard-adm',
  templateUrl: './dashboard-adm.component.html',
  styleUrls: ['./dashboard-adm.component.scss'],
})
export class DashboardAdmComponent implements OnInit, AfterViewInit {
  createuser_userid: any;
  createuser_usertype: any;
  constructor(
    ) {
    }

  ngOnInit() {

  }

  ngAfterViewInit() {
  }
  createuser() {
    return;
  }
  deleteuser() {
    return;
  }
  updateuser() {
    return;
  }
}
