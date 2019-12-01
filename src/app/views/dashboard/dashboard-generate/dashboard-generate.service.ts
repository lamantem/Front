import { Injectable } from '@angular/core';
import {BaseAPIClass} from '../../../core/class';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from '../../../core/services';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardGenerateService extends BaseAPIClass {

  constructor(
      protected httpClient: HttpClient,
      protected localStorageService: LocalStorageService
  ) {
    super(httpClient, localStorageService);
  }

  public prepareQuestionUrl(): void {
    this.baseUrl = environment.api_url + '/banco/questao/listar-todos/';
  }

  public prepareAlternativesUrl(): void {
    this.baseUrl = environment.api_url + '/banco/alternativa/listar-todos/';
  }
}
