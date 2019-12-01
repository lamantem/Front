import { Injectable } from '@angular/core';
import {BaseAPIClass} from '../../../core/class';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from '../../../core/services';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardRateService extends BaseAPIClass {

  constructor(
      protected httpClient: HttpClient,
      protected localStorageService: LocalStorageService
  ) {
    super(httpClient, localStorageService);
  }

  public prepareQuestionUrl(): void {
    this.baseUrl = environment.api_url + '/banco/questao/listar-todos/';
  }

  public prepareAlternativeUrl(): void {
    this.baseUrl = environment.api_url + '/banco/alternativa/listar-todos/';
  }

  public prepareComplaintUrl(): void {
    this.baseUrl = environment.api_url + '/banco/reclamacao/listar-todos/';
  }
}
