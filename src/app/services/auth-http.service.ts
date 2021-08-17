import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {LoginModel} from '../models';
import {LoginResponse} from '../models/login-response';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthHttpService {
  API_URL: string = environment.API_URL;

  constructor(private httpClient: HttpClient, private authService: AuthService) {

  }

  login(credentials: LoginModel): Observable<LoginResponse> {
    const url = `${this.API_URL}/auth/login`;
    return this.httpClient.post<LoginResponse>(url, credentials)
      .pipe(
        map(response => response),
        tap(
          response => {
            this.authService.token = response.token;
            this.authService.user = response.data.user;
            this.authService.roles = response.data.roles;
            this.authService.permissions = response.data.permissions;
          }
        ),
        catchError(error => {
          this.authService.removeLogin();
          return throwError(error);
        })
      );
  }

}
