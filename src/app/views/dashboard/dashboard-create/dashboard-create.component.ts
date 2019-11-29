import { AfterViewInit, OnInit, Component } from '@angular/core';

@Component({
  selector: 'dashboard-create',
  templateUrl: './dashboard-create.component.html',
  styleUrls: ['./dashboard-create.component.scss'],
})
export class DashboardCreateComponent implements OnInit, AfterViewInit {
  //  \/c olocar as UC aqui
  useruc: any;
  CurricularUnit: any;
  Course: any;
  constructor(
    ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  onSubmit() {
    return;
  }
}
