import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from "@angular/common";
import { AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule } from '@coreui/angular';
import { AppMaterialModule } from "../app.material.module";
import { ViewsRoutingModule } from "./views.routing.module";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LoginComponent } from './login/login.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { BsDropdownModule, ButtonsModule, TabsModule } from 'ngx-bootstrap';
import { LayoutComponent } from '../shared/layout';
import { LogoutComponent } from './logout/logout.component';
import { ViewsService } from './views.service';
import { ChartsModule } from 'ng2-charts';
import { NgxCaptchaModule } from "ngx-captcha";
import { BrMaskerModule } from 'br-mask';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  imports: [
    CommonModule,
    ViewsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    NgxCaptchaModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    AppMaterialModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrMaskerModule
  ],
  declarations: [
    LoginComponent,
    LogoutComponent,
    LayoutComponent
  ],
  providers: [
    ViewsService
  ]
})
export class ViewsModule { }
