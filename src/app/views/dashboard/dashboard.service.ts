import { Injectable } from '@angular/core';
import {BaseAPIClass} from '../../core/class';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from '../../core/services';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DashboardService extends BaseAPIClass {
    baseUrl: string;

    constructor(
        protected httpClient: HttpClient,
        protected localStorageService: LocalStorageService,
    ) {
        super(httpClient, localStorageService);
    }

    public prepareUserTypeUrl(): void {
        this.baseUrl = environment.api_url + '/banco/usuario-tipo/listar-todos/';
    }
}
