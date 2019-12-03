import { AfterViewInit, OnInit, Component } from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {DashboardAdmService} from './dashboard-adm.service';

@Component({
  selector: 'dashboard-adm',
  templateUrl: './dashboard-adm.component.html',
  styleUrls: ['./dashboard-adm.component.scss'],
})
export class DashboardAdmComponent implements OnInit, AfterViewInit {
  createuser_email: any;
  createuser_password: any;
  createuser_type: any;
  typeDataSource: DashboardModel.Type[] = [];
  private user: any;
  private id: any;
  constructor(
      private admService: DashboardAdmService,
  ) {
    }

  ngOnInit() {
    this.loadType();
  }

  ngAfterViewInit() {
  }
  createuser() {
    // tem que criar um PERFIL, pois sem um perfilID não existirá user
    return;
  }
  private loadType(): void {
    this.admService.prepareTypeUrl();
    this.admService.getAll()
        .pipe(debounceTime(300))
        .subscribe(
            (response) => {
              this.typeDataSource = response;
            },
            error => {
              console.warn(error.toString());
            }
        );
  }
  private getUserById(id): void {
    this.admService.getUserById(id);
    this.admService.getAll()
        .pipe(debounceTime(300))
        .subscribe(
            (response) => {
              this.user = response;
            },
            error => {
              console.warn(error.toString());
            }
        );
  }
}
