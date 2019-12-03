import { Injectable } from '@angular/core';
import {BaseAPIClass} from '../../../core/class';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from '../../../core/services';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DashboardAdmService extends BaseAPIClass {

    constructor(
        protected httpClient: HttpClient,
        protected localStorageService: LocalStorageService
    ) {
        super(httpClient, localStorageService);
    }
    public getUserById(id): void {
        this.baseUrl = environment.api_url + '/banco/usuario//buscar-por-id/' + id + '/';
    }
    public prepareTypeUrl(): void {
        this.baseUrl = environment.api_url + '/banco/tipo/listar-todos/';
    }
    public prepareProfilelUrl(): void {
        this.baseUrl = environment.api_url + '/banco/perfil/salvar/';
    }
    public prepareUserUrl(): void {
        this.baseUrl = environment.api_url + '/banco/usuario/salvar/';
    }
}
