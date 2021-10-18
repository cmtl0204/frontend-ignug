import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {environment} from '@env/environment';
import {LoginModel} from '@models/core';
import {LoginResponse} from '@models/core/login.response';
import {AuthService} from './auth.service';
import {JobBoardService} from '@services/job-board/job-board.service';
import {createWebpackLoggingCallback} from "@angular-devkit/build-angular/src/webpack/utils/stats";

@Injectable({
  providedIn: 'root'
})

export class AuthHttpService {
  API_URL: string = environment.API_URL;

  constructor(private httpClient: HttpClient, private authService: AuthService, private jobBoardService: JobBoardService) {

  }

  login(credentials: LoginModel): Observable<LoginResponse> {
    const url = `${this.API_URL}/auth/login`;
    return this.httpClient.post<LoginResponse>(url, credentials)
      .pipe(
        map(response => response),
        tap(
          response => {
            console.log(response);
            this.jobBoardService.professional = response.data.professional;
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
