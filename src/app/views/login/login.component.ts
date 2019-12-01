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
                    console.log(response);
                    const protocol = _.filter(response, {
                        'email': email,
                        'senha': password
                    });

                    if (_.isEmpty(protocol)) {
                        Swal.fire('Ops!', 'E-mail ou senha incorretos!', 'error');
                    }

                    this.localStorage.setItem('user',
                        JSON.stringify(response)
                    );

                    this.router.navigate(['/']);
                },
                error => {
                    console.warn(error.toString());
                }
            );

        // const authservice = this.authService;
        // this.submitted  = true;
        // authservice.login(
        //     email,
        //     password
        // )
        //     .pipe(debounceTime(300))
        //     .subscribe(
        //         (response) => {
        //
        //             authservice.currentUser(
        //                 response
        //             )
        //                 .subscribe(
        //                     (resp_auth) => {
        //                         authservice.setCurrentUser(resp_auth.data);
        //                         this.router.navigate(['/']);
        //                     },
        //                     error_auth => {
        //                         this.submitted = false;
        //                         console.warn(error_auth);
        //                     }
        //                 );
        //         },
        //         error => {}
        //     );
    }

}
