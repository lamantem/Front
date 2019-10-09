import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../core/authentication';
import { DashboardListService } from "../dashboard/dashboard-list/dashboard-list.service";
import { LocalStorageService } from "../../core/services";
import { environment } from "../../../environments/environment";

import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  preserveWhitespaces: false
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted: boolean;
  hide: boolean;
  synchronized: boolean;
  app_version: string;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    public dashboardListService: DashboardListService,
    public localStorage: LocalStorageService,
  ) {
    translate.setDefaultLang('pt-br');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|pt-br/) ? browserLang : 'pt-br');
  }

  ngOnInit() {
    this.submitted = false;
    this.hide      = true;

    this.prepareAppVersion();

    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      });
  }

  get fields() {
    return this.loginForm.controls;
  }

  prepareAppVersion() : void {
    this.app_version = environment.app_version;
  }

  onSubmit() {
    let email    = this.loginForm.get('email').value;
    let password = this.loginForm.get('password').value;

    if (this.loginForm.valid) {
      this.login(
        email,
        password
      );
    }

    if (!this.loginForm.valid) {
      Swal.fire('Ops!', 'Favor avaliar os campos obrigatórios!', 'error');
      return;
    }
  }

  private login(email, password): void {
    let authservice = this.authService;
    this.submitted  = true;
    authservice.login(
      email,
      password
    )
      .pipe(debounceTime(300))
      .subscribe(
        (response) => {

          authservice.currentUser(
            response
          )
            .subscribe(
              (resp_auth) => {
                authservice.setCurrentUser(resp_auth.data);
                this.dashboardListService.getGroupReaderUrl();
                this.dashboardListService.getAll()
                  .pipe(debounceTime(300))
                  .subscribe(
                    (response) => {
                      if (response.status === 200) {
                        if (typeof localStorage === 'object') {
                          try {
                            localStorage.setItem('localStorage', '1');
                            localStorage.removeItem('localStorage');
                          } catch (e) {
                            Storage.prototype._setItem = Storage.prototype.setItem;
                            Storage.prototype.setItem = function() {};
                            alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
                          }
                        }
                        let groups = response.data;
                        this.localStorage.setItem('groups', JSON.stringify(groups));
                        let protocols = [];
                        groups.forEach(function (group) {
                          group.protocols.forEach(function (protocol) {
                              let protocol_local = {
                                  id:                protocol.id,
                                  date_reader:       protocol.date_reader,
                                  categories_id:     protocol.categories_id,
                                  group_reader_id:   protocol.group_reader_id,
                                  moderator_id:      protocol.moderator_id,
                                  participant_id:    protocol.participant_id,
                                  participant_name:  protocol.participant_name,
                                  protocol_type:     protocol.protocol_type,
                                  registration_code: protocol.registration_code,
                                  period:            protocol.period,
                                  active: 1,
                                  sync: 1
                              };
                            protocols.push(protocol_local);
                          });
                        });
                        this.localStorage.setItem('protocols', JSON.stringify(protocols));
                        this.synchronized = true;
                        this.localStorage.setItem('synchronized', JSON.stringify(this.synchronized));
                        this.submitted = false;
                      }
                      this.router.navigate(['/'])
                        .catch(reason => {
                          console.warn(reason);
                        });
                    },
                    error => {
                      this.submitted = false;
                      console.warn(error.toString())
                    }
                  );
              },
              error_auth => {
                this.submitted = false;
                console.warn(error_auth)
              }
            );
        },
        error => {
          this.submitted = false;
          Swal.fire('Ops!', 'E-mail informado não existe ou a senha está incorreta!', 'error');
        }
      );
  }

}
