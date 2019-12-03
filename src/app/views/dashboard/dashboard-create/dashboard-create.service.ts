import { Injectable } from '@angular/core';
import {BaseAPIClass} from '../../../core/class';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from '../../../core/services';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardCreateService extends BaseAPIClass {

  constructor(
      protected httpClient: HttpClient,
      protected localStorageService: LocalStorageService
  ) {
    super(httpClient, localStorageService);
  }

  public prepareDifficultyUrl(): void {
    this.baseUrl = environment.api_url + '/banco/dificuldade/listar-todos/';
  }

  public saveQuestionUrl(): void {
    this.baseUrl = environment.api_url + '/banco/questao/salvar/';
  }

  public prepareUcUrl(): void {
    this.baseUrl = environment.api_url + '/banco/uc/listar-todos/';
  }

  public prepareCourseUrl(): void {
    this.baseUrl = environment.api_url + '/banco/curso/listar-todos/';
  }

  public prepareAllQuestionsUrl(): void {
    this.baseUrl = environment.api_url + '/banco/questao/listar-todos/';
  }

  public prepareQuestionUrl(): void {
    this.baseUrl = environment.api_url + '/banco/questao/salvar';
  }

  public prepareAlternativesUrl(): void {
    this.baseUrl = environment.api_url + '/banco/alternativa/salvar';
  }
}
