import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaginatorModel, ServerResponse} from '@models/core';
import {
  AcademicFormationModel,
  CategoryModel,
  CourseModel,
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

export class JobBoardHttpService {

  API_URL: string = environment.API_URL;

  constructor(private httpClient: HttpClient, private messageService: MessageService) {
  }

  getProfile(id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professional/profile/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  registrationProfessional(professional: ProfessionalModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/registration/professional`;
    return this.httpClient.post<ServerResponse>(url, professional)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateProfile(id: number, professional: ProfessionalModel): Observable<ServerResponse> {
    const url = `${this.API_URL}/professional/profile/${id}`;
    return this.httpClient.put<ServerResponse>(url, professional)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
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

  getAcademicFormations(professionalId: number, paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/academic-formations`;
    const params = new HttpParams()
      .set('page', paginator.current_page)
      .set('per_page', paginator.per_page);
    // El filtro depende de los campos propios que sean cadenas de texto
    if (filter !== '') {
      filter = `?senescytCode=${filter}`;
    }
    return this.httpClient.get<ServerResponse>(url + filter, {params})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  getAcademicFormation(professionalId: number, id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/academic-formations/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeAcademicFormation(academicFormation: AcademicFormationModel, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/academic-formations`;
    return this.httpClient.post<ServerResponse>(url, academicFormation)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateAcademicFormation(id: number, academicFormation: AcademicFormationModel, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/academic-formations/${id}`;
    return this.httpClient.put<ServerResponse>(url, academicFormation)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteAcademicFormation(id: number, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/academic-formations/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteAcademicFormations(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/academic-formation/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  getExperiences(professionalId: number, paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/experiences`;
    const params = new HttpParams()
      .set('page', paginator.current_page)
      .set('per_page', paginator.per_page);
    // El filtro depende de los campos propios que sean cadenas de texto
    if (filter !== '') {
      filter = `?senescytCode=${filter}&employer=${filter}&position=${filter}&reason_leave=${filter}`;
    }
    return this.httpClient.get<ServerResponse>(url + filter, {params})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  getExperience(professionalId: number, id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/experiences/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeExperience(experience: ExperienceModel, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/experiences`;
    return this.httpClient.post<ServerResponse>(url, experience)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateExperience(id: number, experience: ExperienceModel, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/experiences/${id}`;
    return this.httpClient.put<ServerResponse>(url, experience)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteExperience(id: number, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/experiences/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteExperiences(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/experience/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  getLanguages(professionalId: number, paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/languages`;
    const params = new HttpParams()
      .set('page', paginator.current_page)
      .set('per_page', paginator.per_page);
    // El filtro depende de los campos propios que sean cadenas de texto
    if (filter !== '') {
      filter = '';
    }
    return this.httpClient.get<ServerResponse>(url + filter, {params})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  getLanguage(professionalId: number, id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/languages/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeLanguage(language: LanguageModel, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/languages`;
    return this.httpClient.post<ServerResponse>(url, language)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateLanguage(id: number, language: LanguageModel, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/languages/${id}`;
    return this.httpClient.put<ServerResponse>(url, language)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteLanguage(id: number, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/languages/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteLanguages(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/language/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  getReferences(professionalId: number, paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/references`;
    const params = new HttpParams()
      .set('page', paginator.current_page)
      .set('per_page', paginator.per_page);
    // El filtro depende de los campos propios que sean cadenas de texto
    if (filter !== '') {
      filter = `?position=${filter}&contact_name=${filter}&contact_phone=${filter}&contact_email=${filter}&institution=${filter}`;
    }
    return this.httpClient.get<ServerResponse>(url + filter, {params})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  getReference(professionalId: number, id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/references/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeReference(reference: ReferenceModel, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/references`;
    return this.httpClient.post<ServerResponse>(url, reference)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateReference(id: number, reference: ReferenceModel, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/references/${id}`;
    return this.httpClient.put<ServerResponse>(url, reference)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteReference(id: number, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/references/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteReferences(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/reference/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  getSkills(professionalId: number, paginator: PaginatorModel, filter: string = ''): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/skills`;
    const params = new HttpParams()
      .set('page', paginator.current_page)
      .set('per_page', paginator.per_page);
    // El filtro depende de los campos propios que sean cadenas de texto
    if (filter !== '') {
      filter = `?description=${filter}`;
    }
    return this.httpClient.get<ServerResponse>(url + filter, {params})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  getSkill(professionalId: number, id: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/skills/${id}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  storeSkill(skill: SkillModel, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/skills`;
    return this.httpClient.post<ServerResponse>(url, skill)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  updateSkill(id: number, skill: SkillModel, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/skills/${id}`;
    return this.httpClient.put<ServerResponse>(url, skill)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteSkill(id: number, professionalId: number): Observable<ServerResponse> {
    const url = `${this.API_URL}/professionals/${professionalId}/skills/${id}`;
    return this.httpClient.delete<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

  deleteSkills(ids: (number | undefined)[]): Observable<ServerResponse> {
    const url = `${this.API_URL}/skill/destroys`;
    return this.httpClient.patch<ServerResponse>(url, {ids})
      .pipe(
        map(response => response),
        catchError(Handler.render)
      );
  }

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
