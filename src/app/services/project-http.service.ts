import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ServerResponse} from '../models/server-response';
import {Handler} from '../exceptions/handler';
import {environment} from '../../environments/environment';
import {ProjectModel} from '../models';

@Injectable({
  providedIn: 'root'
})

export class ProjectHttpService {
  API_URL: string = environment.API_URL;

  constructor(private httpClient: HttpClient) {

  }

  getAll(): Observable<ServerResponse> {
    const url = this.API_URL + '/projects';
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  getOne(id: number): Observable<ServerResponse> {
    const url = this.API_URL + '/projects/' + id;

    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  store(project: ProjectModel): Observable<ServerResponse> {
    const url = this.API_URL + '/projects';
    return this.httpClient.post<ServerResponse>(url, project)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  update(id: number | undefined, project: ProjectModel): Observable<ServerResponse> {
    const url = this.API_URL + '/projects/' + id;
    return this.httpClient.put<ServerResponse>(url, project)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  delete(id: number | undefined): Observable<ServerResponse> {
    const url = this.API_URL + '/projects/' + id;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  changeState(id: number, project: ProjectModel): Observable<ServerResponse> {
    const url = this.API_URL + '/project/' + id + '/state';
    return this.httpClient.patch<ServerResponse>(url, project)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }
}
