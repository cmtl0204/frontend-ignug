import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaginatorModel, ServerResponse} from '@models/core';
import {CourseModel} from '@models/job-board';
import {catchError, map} from 'rxjs/operators';
import {Handler} from '../../exceptions/handler';

@Injectable({
  providedIn: 'root'
})

export class JobBoardHttpService {
  getSkill(arg0: number, id: any) {
    throw new Error('Method not implemented.');
  }
  API_URL: string = environment.API_URL;

  constructor(private httpClient: HttpClient) {
  }

  getCourses(professionalId: number, paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/courses`;
    const params = new HttpParams()
      .set('page', paginator.current_page)
      .set('per_page', paginator.per_page);
    // El filtro depende de los campos propios que sean cadenas de texto
    if (filter !== '') {
      filter = `?name=${filter}&description=${filter}`;
    }
    return this.httpClient.get<ServerResponse>(url + filter, {params})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  getCourse(professionalId: number, id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/courses/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeCourse(course: CourseModel, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/courses`;
    return this.httpClient.post<ServerResponse>(url, course)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateCourse(id: number, course: CourseModel, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/courses/${id}`;
    return this.httpClient.put<ServerResponse>(url, course)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteCourse(id: number, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/courses/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteCourses(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/course/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }
}
