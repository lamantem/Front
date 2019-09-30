import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LocalStorageService } from "../../core/services";
import { Location } from "@angular/common";
import { environment } from "../../../environments/environment";
import { BaseAPIClass } from "../../core/class";

@Injectable({
  providedIn: 'root'
})
export class LayoutService extends BaseAPIClass{

  constructor(
    protected httpClient: HttpClient,
    protected localStorageService: LocalStorageService,
    protected location: Location
  ) {
    super(httpClient, localStorageService, location);
  }

  public prepareSyncProtocolUrl(): void {
    this.baseUrl = environment.api_url + '/' + environment.api_version +
      '/scanner/protocols/sync';
  }

  public deleteSyncProtocolUrl(): void {
    this.baseUrl = environment.api_url + '/' + environment.api_version +
      '/scanner/protocols/all';
  }
}
