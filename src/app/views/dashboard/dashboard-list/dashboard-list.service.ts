import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Location } from '@angular/common';
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
  }

  public getGroupReaderUrl() : void {
    this.baseUrl = environment.api_url + '/' + environment.api_version +
      '/scanner/groups';
  }

}
