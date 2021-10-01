import {Injectable} from '@angular/core';
import themes from '../../../assets/themes/themes.json';
import {MenuItem} from 'primeng/api';
import {Observable} from 'rxjs';
import {ServerResponse} from '@models/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Handler} from '../../exceptions/handler';
import {environment} from '@env/environment';

@Injectable({
  providedIn: 'root'
})

export class CoreHttpService {
  API_URL: string = environment.API_URL;
  constructor(private httpClient: HttpClient) {
  }

  getCatalogues(type: string | undefined): Observable<ServerResponse> {
    const params = new HttpParams().append('type', String(type));
    const url = this.API_URL + '/catalogues';
    return this.httpClient.get<ServerResponse>(url, {params})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  getLocations(type: string | undefined): Observable<ServerResponse> {
    const params = new HttpParams().set('type', String(type));
    const url = this.API_URL + '/locations';
    return this.httpClient.get<ServerResponse>(url, {params})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }
}
