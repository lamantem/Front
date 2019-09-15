import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { AuthenticationService } from '../../core/authentication';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    public translate: TranslateService
  ) {
    translate.setDefaultLang('pt-br');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|pt-br/) ? browserLang : 'pt-br');
  }

  ngOnInit() {
    this.submitted = false;
    this.hide      = true;
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      });
  }

  get fields() {
    return this.loginForm.controls;
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
    this.submitted = true;

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
                this.submitted = false;
                authservice.setCurrentUser(resp_auth.data);
                this.router.navigate(['/'])
                  .catch(reason => {
                    console.warn(reason);
                  });
              },
              error_auth => {
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