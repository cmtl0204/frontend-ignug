import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {PaginatorModel, ServerResponse} from '@models/core';
import {Handler} from '../../exceptions/handler';
import {MessageService} from "@services/core";
import {ExampleModel} from '@models/custom';

@Injectable({
  providedIn: 'root'
})

export class CustomHttpService {

  API_URL: string = environment.API_URL;

  constructor(private httpClient: HttpClient, private messageService: MessageService) {
  }


  getCustoms(paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/customs`;
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

  getCustom(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/customs/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeCustom(example: ExampleModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/customs`;
    return this.httpClient.post<ServerResponse>(url, example)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateCustom(id: number, example: ExampleModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/customs/${id}`;
    return this.httpClient.put<ServerResponse>(url, example)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteCustom(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/customs/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteCustoms(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/custom/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }
}
