import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {_throw} from 'rxjs-compat/observable/throw';
import {LocalStorageService} from '../services';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseAPIClass {

  baseUrl: string;

  protected constructor(
    protected httpClient: HttpClient,
    protected localStorageService: LocalStorageService
  ) {}

  getAll(filterObject?: any): Observable<any> {
    let queryString = '';

    if (filterObject) {

      const fitlerKeys: any[] = Object.keys(filterObject);

      if (fitlerKeys.length > 0) {
        queryString = '?';
      }

      fitlerKeys.forEach((key: any, index) => {
        if (filterObject[key] !== undefined && filterObject[key] !== null) {
          if (filterObject[key].toString().length) {
            queryString += `${ key }=${ filterObject[key] }&`;
          }
        }
      });

      if (fitlerKeys.length > 0 && queryString[queryString.length - 1] === '&') {
        queryString = queryString.slice(0, -1);
      }
    }

    return this.httpClient.get(`${ this.baseUrl }${ queryString }`, this.getHttpOptions()
    ).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  getById(id: string): Observable<any> {

    return this.httpClient.get(
      `${ this.baseUrl }/${ id }`,
      this.getHttpOptions()
    )
      .pipe(
        map((response: any) => {
          return response;
        })
      )
      .catch(errorResponse => {
        let errMsg: string;
        if (errorResponse instanceof HttpErrorResponse) {
          const err = errorResponse.message || JSON.stringify(errorResponse.error);
          errMsg = `${ errorResponse.status } - ${ errorResponse.statusText || '' }
                     Details: ${ err }
                     API: ${ errorResponse.error['error'] } - ${ errorResponse.error['message'] }`;
        } else {
          errMsg = errorResponse.message ? errorResponse.message : errorResponse.toString();
        }
        return _throw(errMsg);
      });
  }

  create(payload: any): Observable<any> {
    return this.httpClient.post(this.baseUrl, payload).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  createWithToken(payload: any): Observable<any> {
    return this.httpClient.post(
      this.baseUrl,
      payload,
      this.getHttpOptions()
    )
      .pipe(
        map((body: any) => {
          return body;
        })
      );
  }

  update(id: string, payload: any): Observable<any> {
    return this.httpClient.put(`${ this.baseUrl }/${ id }`, payload).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${ this.baseUrl }/${ id }`).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  deleteAllWithToken(payload: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: payload,
    };

    return this.httpClient.delete(
      this.baseUrl,
      options
    ).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  deleteAll(): Observable<any> {
    return this.httpClient.delete(`${ this.baseUrl }/all`).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  public getHttpOptions(): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
      })
    };
  }

}
