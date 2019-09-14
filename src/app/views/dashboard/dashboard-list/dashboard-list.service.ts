import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Location } from '@angular/common';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { _throw } from "rxjs-compat/observable/throw";
import { BaseAPIClass } from "../../../core/class";
import { LocalStorageService } from "../../../core/services";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DashboardListService extends BaseAPIClass {

  constructor(
    protected httpClient: HttpClient,
    protected localStorageService: LocalStorageService,
    protected location: Location
  ) {
    super(httpClient,localStorageService,location);
    this.baseUrl = environment.api_url + '/' + environment.api_version + '/';
  }

  private prepareContextUrl(page: number): string {
    let attrib_page = (page) ? "?page=" + page : '';
    return this.baseUrl + attrib_page;
  }

}
