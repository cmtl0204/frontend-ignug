import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {CatalogueModel, UserModel} from '@models/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserAdministrationHttpService} from '@services/core/user-administration-http.service';
import {MessageService} from '@services/core';
import {ActivatedRoute, Router} from '@angular/router';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {CourseModel} from '@models/job-board';
import {AppService} from '@services/core/app.service';
import {Subscription} from 'rxjs';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit, OnDestroy, OnExitInterface {
  @Input() user: UserModel = {};
  @Output() userNewOrUpdate = new EventEmitter<UserModel>();

  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  types: CatalogueModel[] = [];
  certificationTypes: CatalogueModel[] = [];
  areas: CatalogueModel[] = [];
  skeletonLoading: boolean = false;
  title: string = 'Crear evento';
  buttonTitle: string = 'Crear evento';

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private formBuilder: FormBuilder,
    private userAdministrationHttpService: UserAdministrationHttpService,
    private jobBardHttpService: JobBoardHttpService,
    private jobBardService: JobBoardService,
    private appService: AppService,
    public messageService: MessageService,
    private activatedRoute: ActivatedRoute) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Cursos y Capacitaciones', routerLink: ['/job-board/professional/course']},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar evento';
      this.buttonTitle = 'Actualizar evento';
      this.getCourse();
      this.form.markAllAsTouched();
    }
    this.getCertificationType();
    this.getTypes();
    this.getAreas();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  async onExit() {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit({}).then((result) => {
        return result.isConfirmed;
      });
    }
    return true;
  }

  getCourse() {
    this.skeletonLoading = true;
    this.subscriptions.push(this.jobBardHttpService.getCourse(this.jobBardService.professional.id!, this.activatedRoute.snapshot.params.id).subscribe(
      response => {
        response.data.startDate = new Date('2021-08-22');
        response.data.startDate.setDate(response.data.startDate.getDate() + 1);
        response.data.endDate = new Date(response.data.endDate);
        response.data.endDate.setDate(response.data.endDate.getDate() + 1);

        this.form.patchValue(response.data);
        this.skeletonLoading = false;
      }, error => {
        this.skeletonLoading = false;
        this.messageService.error(error);
      }
    ));
  }

  newForm(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      type: [null, [Validators.required]],
      certificationType: [null, [Validators.required]],
      area: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null, [Validators.minLength(10)]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      hours: [null, [Validators.required]],
      institution: [null, [Validators.required]],
    });
  }

  getAreas() {
    this.userAdministrationHttpService.getCatalogues('COURSE_AREA').subscribe(
      response => {
        this.areas = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  getCertificationType() {
    this.userAdministrationHttpService.getCatalogues('COURSE_CERTIFICATION_TYPE').subscribe(
      response => {
        this.certificationTypes = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  getTypes() {
    this.userAdministrationHttpService.getCatalogues('COURSE_EVENT_TYPE').subscribe(
      response => {
        this.types = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.idField.value) {
        this.update(this.form.value);
      } else {
        this.store(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  store(course: CourseModel): void {
    this.progressBar = true;
    this.jobBardHttpService.storeCourse(course, this.jobBardService.professional.id!).subscribe(
      response => {
        this.messageService.success(response);
        this.form.reset();
        this.userNewOrUpdate.emit(course);
        this.progressBar = false;
        this.router.navigate(['/job-board/professional/course']);
      },
      error => {
        this.messageService.error(error);
        this.progressBar = false;
      }
    );
  }

  update(course: CourseModel): void {
    this.progressBar = true;
    this.jobBardHttpService.updateCourse(course.id!, course, this.jobBardService.professional.id!).subscribe(
      response => {
        this.messageService.success(response);
        this.form.reset();
        this.userNewOrUpdate.emit(course);
        this.progressBar = false;
        this.router.navigate(['/job-board/professional/course']);
      },
      error => {
        this.messageService.error(error);
        this.progressBar = false;
      }
    );
  }

  get idField() {
    return this.form.controls['id'];
  }

  get typeField() {
    return this.form.controls['type'];
  }

  get certificationTypeField() {
    return this.form.controls['certificationType'];
  }

  get areaField() {
    return this.form.controls['area'];
  }

  get nameField() {
    return this.form.controls['name'];
  }

  get descriptionField() {
    return this.form.controls['description'];
  }

  get startDateField() {
    return this.form.controls['startDate'];
  }

  get endDateField() {
    return this.form.controls['endDate'];
  }

  get hoursField() {
    return this.form.controls['hours'];
  }

  get institutionField() {
    return this.form.controls['institution'];
  }
}
