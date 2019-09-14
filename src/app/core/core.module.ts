import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';
import {
  ApiService,
  RestService
} from './services';
import {
  AuthenticationGuard,
  AuthenticationService
} from "./authentication";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
    ApiService,
    RestService,
    AuthenticationGuard,
    AuthenticationService
  ],
  declarations: []
})
export class CoreModule { }