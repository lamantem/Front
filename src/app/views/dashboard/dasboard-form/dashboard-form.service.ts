import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Location } from '@angular/common';
import { BaseAPIClass } from "../../../core/class";
import { LocalStorageService } from "../../../core/services";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DashboardFormService extends BaseAPIClass {

  constructor(
    protected httpClient: HttpClient,
    protected localStorageService: LocalStorageService,
    protected location: Location
  ) {
    super(httpClient,localStorageService,location);
  }

  public getProtocolReaderUrl(group) : void {
    this.baseUrl = environment.api_url + '/' + environment.api_version +
      '/scanner/groups/'+ group +'/protocols';
  }

}
