import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {CoreHttpService} from '@services/core';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {CatalogueModel} from '@models/core';
import {CourseModel} from '@models/job-board';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})

export class CourseFormComponent implements OnInit, OnDestroy, OnExitInterface {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  loadingSkeleton: boolean = false;
  title: string = 'Crear Evento';
  buttonTitle: string = 'Crear Evento';
  types: CatalogueModel[] = [];
  certificationTypes: CatalogueModel[] = [];
  areas: CatalogueModel[] = [];
  yearRange: string = `1900:${(new Date()).getFullYear()}`

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private coreHttpService: CoreHttpService,
    private jobBoardHttpService: JobBoardHttpService,
    private jobBoardService: JobBoardService
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Cursos y Capacitaciones', routerLink: ['/job-board/professional/course'], disabled: true},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar Evento';
      this.buttonTitle = 'Actualizar Evento';
      this.loadCourse();
    }
    this.loadCertificationTypes();
    this.loadTypes();
    this.loadAreas();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  async onExit() {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit({})
        .then((result) => {
          return result.isConfirmed;
        });
    }
    return true;
  }

  newForm(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      type: [null, [Validators.required]],
      certificationType: [null, [Validators.required]],
      area: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null, [Validators.minLength(10)]],
      startedAt: [null, [Validators.required]],
      endedAt: [null, [Validators.required]],
      hours: [null, [Validators.required]],
      institution: [null, [Validators.required]],
    });
  }

  loadCourse() {
    this.loadingSkeleton = true;
    this.subscriptions.push(
      this.jobBoardHttpService
        .getCourse(this.jobBoardService.professional.id!, this.activatedRoute.snapshot.params.id)
        .subscribe(
          response => {
            this.form.patchValue(response.data);
            this.loadingSkeleton = false;
          }, error => {
            this.loadingSkeleton = false;
            this.messageService.error(error);
          }
        ));
  }

  loadAreas() {
    this.subscriptions.push(
      this.coreHttpService.getCatalogues('COURSE_AREA')
        .subscribe(
          response => {
            this.areas = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  loadCertificationTypes() {
    this.subscriptions.push(
      this.coreHttpService.getCatalogues('COURSE_CERTIFICATION_TYPE')
        .subscribe(
          response => {
            this.certificationTypes = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  loadTypes() {
    this.subscriptions.push(
      this.coreHttpService.getCatalogues('COURSE_EVENT_TYPE')
        .subscribe(
          response => {
            this.types = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
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
    this.subscriptions.push(
      this.jobBoardHttpService.storeCourse(course, this.jobBoardService.professional.id!)
        .subscribe(
          response => {
            this.messageService.success(response);
            this.form.reset();
            this.progressBar = false;
            this.returnList();
          },
          error => {
            this.messageService.error(error);
            this.progressBar = false;
          }
        ));
  }

  update(course: CourseModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.jobBoardHttpService.updateCourse(course.id!, course, this.jobBoardService.professional.id!).subscribe(
        response => {
          this.messageService.success(response);
          this.form.reset();
          this.progressBar = false;
          this.returnList();
        },
        error => {
          this.messageService.error(error);
          this.progressBar = false;
        }
      ));
  }

  isRequired(field: AbstractControl): boolean {
    return field.hasValidator(Validators.required);
  }

  returnList() {
    this.router.navigate(['/job-board/professional', 1]);
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

  get startedAtField() {
    return this.form.controls['startedAt'];
  }

  get endedAtField() {
    return this.form.controls['endedAt'];
  }

  get hoursField() {
    return this.form.controls['hours'];
  }

  get institutionField() {
    return this.form.controls['institution'];
  }
}
