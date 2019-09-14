import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable()
export class ViewsService {

  constructor(
    protected httpClient: HttpClient
  ) {
  }

  private getApiUrl() {
    return environment.api_url + '/' + environment.api_version;
  }

  public recoveryPassword(payload: any): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.httpClient.put<any>(
      this.getApiUrl()+"/oauth/recovery-passwd",
      payload,
      {
        headers: headers
      }
    ).pipe(
      map((body: any) => {
        return body;
      })
    );
  }
}
