import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MessageService} from '@services/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {PaginatorModel, ServerResponse} from '@models/core';
import {CourseModel} from '@models/job-board';
import {catchError, map} from 'rxjs/operators';
import {Handler} from '../../exceptions/handler';

@Injectable({
  providedIn: 'root'
})
export class JobBoardHttpService {
  API_URL: string = environment.API_URL;

  constructor(private httpClient: HttpClient,
              private router: Router,
              private messageService: MessageService) {
  }

  getCourses(professionalId: number, paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/courses`;
    const params = new HttpParams()
      .set('page', paginator.current_page)
      .set('per_page', paginator.per_page);
    console.log(filter);
    if (filter !== '') {
      filter = '?name=' + filter + '&description=' + filter;
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
