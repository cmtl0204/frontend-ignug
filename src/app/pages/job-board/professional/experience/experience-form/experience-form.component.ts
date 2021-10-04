import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {CoreHttpService} from '@services/core';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {CatalogueModel} from '@models/core';
import {ExperienceModel} from '@models/job-board';

@Component({
  selector: 'app-experience-form',
  templateUrl: './experience-form.component.html',
  styleUrls: ['./experience-form.component.scss']
})
export class ExperienceFormComponent implements OnInit, OnDestroy, OnExitInterface {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  skeletonLoading: boolean = false;
  title: string = 'Crear experiencia';
  buttonTitle: string = 'Crear experiencia';

  types: CatalogueModel[] = [];
  certificationTypes: CatalogueModel[] = [];
  areas: CatalogueModel[] = [];

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
      {label: 'Experiencia Profesional', routerLink: ['/job-board/professional/experience']},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar experiencia';
      this.buttonTitle = 'Actualizar experiencia';
      this.loadExperience();
      this.form.markAllAsTouched();
    }

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

  loadExperience():void {
    this.skeletonLoading = true;
    this.subscriptions.push(
      this.jobBoardHttpService
        .getExperience(this.jobBoardService.professional.id!, this.activatedRoute.snapshot.params.id)
      .subscribe(
      response => {
        response.data.startedAt.setDate(response.data.startedAt.getDate() + 1);
        response.data.endedAt.setDate(response.data.endedAt.getDate() + 1);

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
      professional: [null, [Validators.required]],
      area: [null, [Validators.required]],
      activities: [this.formBuilder.array([]), [Validators.required]],
      employer: [null, [Validators.required]],
      endedAt: [null, [Validators.required]],
      position: [null, [Validators.required]],
      reasonLeave: [null, [Validators.required]],
      startedAt: [null, [Validators.required]],
      worked: [false, [Validators.required]],
    });
  }

  loadAreas():void {
    this.coreHttpService.getCatalogues('EXPERIENCE_AREA').subscribe(
      response => {
        this.areas = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  onSubmit():void {
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
    this.jobBoardHttpService.storeCourse(experience, this.jobBoardService.professional.id!).subscribe(
      response => {
        this.messageService.success(response);
        this.progressBar = false;
        this.form.reset();
        this.router.navigate(['/job-board/professional/experience']);
      },
      error => {
        this.messageService.error(error);
        this.progressBar = false;
      }
    );
  }

  update(experience: ExperienceModel): void {
    this.progressBar = true;
    this.jobBoardHttpService.updateExperience(experience.id!, experience, this.jobBoardService.professional.id!)
      .subscribe(
      response => {
        this.messageService.success(response);
        this.progressBar = false;
        this.form.reset();
        this.router.navigate(['/job-board/professional/experience']);
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

  get activitiesField():FormArray {
    return this.form.controls['activities'] as FormArray;
  }

  get employerField() {
    return this.form.controls['employer'];
  }

  get endedAtField() {
    return this.form.controls['endedAt'];
  }

  get positionField() {
    return this.form.controls['position'];
  }

  get reasonLeaveField() {
    return this.form.controls['reason_Leave'];
  }

  get startedAtField() {
    return this.form.controls['startedAt'];
  }

  get workedField() {
    return this.form.controls['worked'];
  }
}

