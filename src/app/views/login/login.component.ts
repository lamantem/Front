import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../core/authentication';
import {LocalStorageService} from '../../core/services';
import {LZStringService} from 'ng-lz-string';
import {LoginService} from './login.service';

import Swal from 'sweetalert2';
import * as _ from 'lodash';
import {navItems} from '../../_nav';

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
        private loginService: LoginService,
        private formBuilder: FormBuilder,
        private router: Router,
        public translate: TranslateService,
        public localStorage: LocalStorageService
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

    onSubmit() {
        const email = this.loginForm.get('email').value;
        const password = this.loginForm.get('password').value;

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
        this.loginService.prepareUserUrl();
        this.loginService.getAll()
            .pipe(debounceTime(300))
            .subscribe(
                (response) => {
                    const protocol = _.filter(response, {
                        'email': email,
                        'senha': password
                    });

                    if (_.isEmpty(protocol)) {
                        Swal.fire('Ops!', 'E-mail ou senha incorretos!', 'error');
                    }

                    this.localStorage.setItem('user',
                        JSON.stringify(protocol)
                    );

                    this.getUserTypeUrl();
                },
                error => {
                    console.warn(error.toString());
                }
            );
    }

    getUserTypeUrl() {
        this.loginService.prepareUserTypeUrl();
        this.loginService.getAll()
            .pipe(debounceTime(300))
            .subscribe(
                (response) => {
                    let potocolo = {};
                    const user = JSON.parse(localStorage['user']);
                    const user_id = user[0].id;
                    response.forEach(function(resp) {
                        if (resp.usuario.id === user_id) {
                            potocolo = resp.tipo;
                        }
                    });
                    this.localStorage.setItem('type',
                        JSON.stringify(potocolo)
                    );

                    this.router.navigate(['/']);
                    debounceTime(4000);
                },
                error => {
                    console.warn(error.toString());
                }
            );
    }



}
