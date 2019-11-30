import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './interceptors';
import {
  ApiService,
  RestService
} from './services';
import {
  AuthenticationGuard,
  AuthenticationService
} from './authentication';
import { ToasterComponent } from './service-worker/toaster/toaster.component';
import {CheckForUpdateService} from './service-worker/check-for-update.service';

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
    AuthenticationService,
    CheckForUpdateService
  ],
  exports: [
    ToasterComponent
  ],
  declarations: [ToasterComponent]
})
export class CoreModule { }
