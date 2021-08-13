import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Handler} from '../exceptions/handler';
import {environment} from '../../environments/environment';
import {LoginModel} from '../models';
import {LoginResponse} from '../models/login-response';

@Injectable({
  providedIn: 'root'
})

export class AuthHttpService {
  API_URL: string = environment.API_URL;

  constructor(private httpClient: HttpClient) {

  }

  login(credentials: LoginModel): Observable<LoginResponse> {
    const url = this.API_URL + '/auth/login';
    return this.httpClient.post<LoginResponse>(url,credentials)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

}
