import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { _throw } from 'rxjs-compat/observable/throw';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthenticationService {

  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private location: Location
  ) {}

  isAuthenticated(): boolean {
    return (this.validateToken());
  }

  validateToken(): boolean {
    return !!(this.getToken());
  }

  login(username, password): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this._httpClient.post<any>(
      this.getData()['loginUrl'],
      {
        username: username,
        password: password,
        client_id: this.getData()['clientId'],
        client_secret: this.getData()['clientSecret'],
        grant_type: this.getData()['grantType'],
        scope: this.getData()['scope']
      },
      {
        headers: headers
      })
      .map(response => {
        if (response) {
          this.setToken(response);
        }
        return response;
      })
      .catch(errorResponse => {
        let errMsg: string;
        if (errorResponse instanceof HttpErrorResponse) {
          const err = errorResponse.message || JSON.stringify(errorResponse.error);
          errMsg = `${errorResponse.status} - ${errorResponse.statusText || ''}
                     Details: ${err}
                     API: ${errorResponse.error['error']} - ${errorResponse.error['message']}`;
        } else {
          errMsg = errorResponse.message ? errorResponse.message : errorResponse.toString();
        }
        return _throw(errMsg);
      });
  }

  setToken(token): void {
    if (token) {
      localStorage.setItem(this.keyTokenName(), JSON.stringify(token));
    }
  }

  getToken(): string {
    return localStorage.getItem(this.keyTokenName());
  }

  keyTokenName(): any {
    return 'appToken';
  }

  deleteToken(): void {
    if (this.getToken()) {
      localStorage.removeItem(this.keyTokenName());
    }
  }

  localStorageClear(): void {
    localStorage.clear();
  }

  keyCurrentUser(): any {
    return 'appUser';
  }

  currentUser(response: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + response.access_token
      })
    };

    const url_endpoint = environment.api_url + '/' + environment.api_version + '/auth-user';

    return this._httpClient.get(
      url_endpoint,
      httpOptions
    ).pipe(
        // tslint:disable-next-line:no-shadowed-variable
      map((response: any) => {
        return response;
      })
    );
  }

  setCurrentUser(user): void {
    localStorage.setItem(this.keyCurrentUser(), JSON.stringify(user));
  }

  getCurrentUser(): string {
    const user = localStorage.getItem(this.keyCurrentUser());
    return JSON.parse(user);
  }

  deleteCurrentUser(): void {
    if (this.getCurrentUser()) {
      localStorage.removeItem(this.keyCurrentUser());
      localStorage.clear();
    }
  }

  getData(): any {
    return {
      loginUrl: environment.api_url + '/' + environment.api_version + '/' + environment.auth_url,
      clientId: environment.client_id,
      clientSecret: environment.client_secret,
      grantType: environment.grantType,
      scope: environment.scope
    };
  }

}
