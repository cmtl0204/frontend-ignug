import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {CatalogueModel, UserModel} from '@models/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserAdministrationHttpService} from '@services/core/user-administration-http.service';
import {MessageService} from '@services/core';
import {ActivatedRoute, Router} from '@angular/router';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {ExperienceModel} from '@models/job-board';
import {AppService} from '@services/core/app.service';
import {Subscription} from 'rxjs';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';

@Component({
  selector: 'app-experience-form',
  templateUrl: './experience-form.component.html',
  styleUrls: ['./experience-form.component.scss']
})
export class ExperienceFormComponent implements OnInit, OnDestroy, OnExitInterface {
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
      this.getExperience();
      this.form.markAllAsTouched();
    }
    this.getAreas();
    this.getProfessional();
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

  getExperience() {
    this.skeletonLoading = true;
    this.subscriptions.push(this.jobBardHttpService.getExperience(this.jobBardService.professional.id!, this.activatedRoute.snapshot.params.id).subscribe(
      response => {
        response.data.startAt.setDate(response.data.startAt.getDate() + 1);
        response.data.endAt.setDate(response.data.endAt.getDate() + 1);

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
      area: [null, [Validators.required]],
      professional: [null, [Validators.required]],
      activities: [this.formBuilder.array([]), [Validators.required]],
      employer: [null, [Validators.required]],
      endAt: [null, [Validators.required]],
      position: [null, [Validators.required]],
      reasonLeave: [null, [Validators.required]],
      startAt: [null, [Validators.required]],
      worked: [false, [Validators.required]],
    });
  }
//ForeignKeys
  getAreas() {
    this.coreHttpService.getCatalogues('COURSE_AREA').subscribe(
      response => {
        this.areas = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  getProfessional() {
    this.job_boardHttpService.getProfessional('PROFESSIONAL').subscribe(
      response => {
        this.certificationTypes = response.data;
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

  store(experience: ExperienceModel): void {
    this.progressBar = true;
    this.jobBardHttpService.storeCourse(experience, this.jobBardService.professional.id!).subscribe(
      response => {
        this.messageService.success(response);
        this.form.reset();
        this.userNewOrUpdate.emit(experience);
        this.progressBar = false;
        this.router.navigate(['/job-board/professional/course']);
      },
      error => {
        this.messageService.error(error);
        this.progressBar = false;
      }
    );
  }

  update(experience: ExperienceModel): void {
    this.progressBar = true;
    this.jobBardHttpService.updateCourse(experience.id!, experience, this.jobBardService.professional.id!).subscribe(
      response => {
        this.messageService.success(response);
        this.form.reset();
        this.userNewOrUpdate.emit(experience);
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

  get areaField() {
    return this.form.controls['area'];
  }

  get professionalField() {
    return this.form.controls['professional'];
  }

  get activitiesField() {
    return this.form.controls['activities'];
  }

  get employerField() {
    return this.form.controls['employer'];
  }

  get endAtField() {
    return this.form.controls['endAt'];
  }

  get positionField() {
    return this.form.controls['position'];
  }

  get reasonLeaveField() {
    return this.form.controls['reason_Leave'];
  }

  get startAtField() {
    return this.form.controls['startAt'];
  }

  get workedField() {
    return this.form.controls['worked'];
  }
}

