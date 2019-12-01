import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from '../../core/services';
import {BaseAPIClass} from '../../core/class';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseAPIClass{

  constructor(
      protected httpClient: HttpClient,
      protected localStorageService: LocalStorageService
  ) {
    super(httpClient, localStorageService);
  }

  public prepareUserUrl(): void {
    this.baseUrl = environment.api_url + '/banco/usuario/listar-todos/';
  }
}
