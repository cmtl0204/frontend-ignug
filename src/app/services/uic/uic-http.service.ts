import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaginatorModel, ServerResponse} from '@models/core';
import {
  AcademicFormationModel,
  CategoryModel,
  StudentModel,
  ExperienceModel,
  LanguageModel,
  ProfessionalModel,
  ReferenceModel,
  SkillModel
} from '@models/job-board';
import {catchError, map} from 'rxjs/operators';
import {Handler} from '../../exceptions/handler';
import {MessageService} from "@services/core";

@Injectable({
  providedIn: 'root'
})

export class UicHttpService {

  API_URL: string = environment.API_URL;

  constructor(private httpClient: HttpClient, private messageService: MessageService) {
  }

  //Student

  getStudents(paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/students`;
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

  getStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeStudent(student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students`;
    return this.httpClient.post<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateStudent(id: number, student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.put<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudents(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/student/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }
  
  //Student Information

  getStudentInformations(paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/student-informations`;
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

  getStudentInformation(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/student-informations/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeStudentInformation(student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/student-informations`;
    return this.httpClient.post<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateStudentInformation(id: number, student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/student-informations/${id}`;
    return this.httpClient.put<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudentInformation(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/student-informations/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudentInformations(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/student-information/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  //Requirement Requests

  getRequirementRequests(paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/requirement-requests`;
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

  getRequirementRequest(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/requirement-requests/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeRequirementRequest(student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/requirement-requests`;
    return this.httpClient.post<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateRequirementRequest(id: number, student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/requirement-requests/${id}`;
    return this.httpClient.put<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteRequirementRequest(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/requirement-requests/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteRequirementRequests(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/requirement-request/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  // Santiago
  
  getStudents(paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/events`;
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

  getStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeStudent(student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students`;
    return this.httpClient.post<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateStudent(id: number, student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.put<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudents(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/event/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  //

  getStudents(paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/students`;
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

  getStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeStudent(student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students`;
    return this.httpClient.post<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateStudent(id: number, student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.put<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudents(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/student/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  //

  getStudents(paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/students`;
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

  getStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeStudent(student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students`;
    return this.httpClient.post<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateStudent(id: number, student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.put<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudents(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/student/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  //didyer

  getStudents(paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/students`;
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

  getStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeStudent(student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students`;
    return this.httpClient.post<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateStudent(id: number, student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.put<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudents(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/student/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }
  getStudents(paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/students`;
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

  getStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeStudent(student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students`;
    return this.httpClient.post<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateStudent(id: number, student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.put<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudents(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/student/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }
  getStudents(paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/students`;
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

  getStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeStudent(student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students`;
    return this.httpClient.post<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateStudent(id: number, student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.put<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudents(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/student/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  //Jimmy 
  
  getStudents(paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/students`;
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

  getStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeStudent(student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students`;
    return this.httpClient.post<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateStudent(id: number, student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.put<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudents(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/student/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }
  getStudents(paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/students`;
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

  getStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeStudent(student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students`;
    return this.httpClient.post<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateStudent(id: number, student: StudentModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.put<ServerResponse>(url, student)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudent(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/students/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteStudents(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/student/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  //Example
  getProfessionalDegrees(): Observable<ServerResponse> {
    const url = `${this.API_URL}/category/professional-degrees`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeProfessionalDegree(category: CategoryModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/category/professional-degrees`;
    return this.httpClient.post<ServerResponse>(url, category)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateProfessionalDegree(id: number, category: CategoryModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/category/professional-degrees/${id}`;
    return this.httpClient.put<ServerResponse>(url, category)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  getAreas(): Observable<ServerResponse> {
    const url = `${this.API_URL}/category/areas`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeArea(category: CategoryModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/category/areas`;
    return this.httpClient.post<ServerResponse>(url, category)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateArea(id: number, category: CategoryModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/category/areas/${id}`;
    return this.httpClient.put<ServerResponse>(url, category)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  getCategories(paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/categories`;
    const params = new HttpParams()
      .set('page', paginator.current_page)
      .set('per_page', paginator.per_page);
    // El filtro depende de los campos propios que sean cadenas de texto
    if (filter !== '') {
      filter = `?code=${filter}&name=${filter}&icono=${filter}`;
    }
    return this.httpClient.get<ServerResponse>(url + filter, {params})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  getCategory(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/categories/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeCategory(category: CategoryModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/categories`;
    return this.httpClient.post<ServerResponse>(url, category)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateCategory(id: number, category: CategoryModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/categories/${id}`;
    return this.httpClient.put<ServerResponse>(url, category)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteCategory(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/categories/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteCategories(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/category/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  downloadCertificate(username: string): void {
    const url = `${this.API_URL}/professional/certificate/${username}`;
    this.messageService.showLoading();
    this.httpClient.get(url, {responseType: 'blob' as 'json'}).subscribe(response => {
      const binaryData = [] as BlobPart[];
      binaryData.push(response as BlobPart);
      const filePath = URL.createObjectURL(new Blob(binaryData, {type: 'pdf'}));
      const downloadLink = document.createElement('a');
      downloadLink.href = filePath;
      downloadLink.setAttribute('download', `certificado-${username}.pdf`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      this.messageService.hideLoading();
    }, error => {
      this.messageService.error(error);
      this.messageService.hideLoading();
    });
  }
}
