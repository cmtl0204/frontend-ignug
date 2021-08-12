import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ServerResponse} from '../models/server-response';
import {Handler} from '../exceptions/handler';
import {environment} from '../../environments/environment';
import {LoginModel} from '../models';

@Injectable({
  providedIn: 'root'
})

export class AuthHttpService {
  API_URL: string = environment.API_URL;

  constructor(private httpClient: HttpClient) {

  }

  login(credentials: LoginModel): Observable<ServerResponse> {
    console.log(credentials);
    const url = this.API_URL + '/auth/login';
    return this.httpClient.post<ServerResponse>(url,credentials)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

}
