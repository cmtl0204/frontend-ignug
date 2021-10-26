import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
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
  loadingSkeleton: boolean = false;
  title: string = 'Crear Experiencia Profesional';
  buttonTitle: string = 'Crear Experiencia Profesional';
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
      {label: 'Experiencias Profesionales', routerLink: ['/job-board/professional/experience'], disabled: true},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
    this.workedField.valueChanges.subscribe(value => {
      this.verifyWorkedValidators();
    });
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar Experiencia Profesional';
      this.buttonTitle = 'Actualizar Experiencia Profesional';
      this.loadExperience();
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

  newForm(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      area: [null, [Validators.required]],
      activities: this.formBuilder.array([this.formBuilder.control(null, Validators.required)]),
      employer: [null, [Validators.required]],
      endedAt: [null],
      position: [null, [Validators.required]],
      reasonLeave: [null],
      startedAt: [null, [Validators.required]],
      worked: [false, [Validators.required]],
    });
  }

  loadExperience(): void {
    this.loadingSkeleton = true;
    this.subscriptions.push(
      this.jobBoardHttpService
        .getExperience(this.jobBoardService.professional.id!, this.activatedRoute.snapshot.params.id)
        .subscribe(
          response => {
            this.form.patchValue(response.data);
            this.activitiesField.clear();
            response.data.activities.forEach((value: string) => {
              this.addActivity(value);
            });
            this.loadingSkeleton = false;
          }, error => {
            this.loadingSkeleton = false;
            this.messageService.error(error);
          }
        ));
  }

  loadAreas(): void {
    this.subscriptions.push(
      this.coreHttpService.getCatalogues('EXPERIENCE_AREA')
        .subscribe(
          response => {
            this.areas = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  onSubmit(): void {
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
    this.subscriptions.push(
      this.jobBoardHttpService.storeExperience(experience, this.jobBoardService.professional.id!)
        .subscribe(
          response => {
            this.messageService.success(response);
            this.progressBar = false;
            this.form.reset();
            this.returnList();
          },
          error => {
            this.messageService.error(error);
            this.progressBar = false;
          }
        ));
  }

  update(experience: ExperienceModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.jobBoardHttpService.updateExperience(experience.id!, experience, this.jobBoardService.professional.id!)
        .subscribe(
          response => {
            this.messageService.success(response);
            this.progressBar = false;
            this.form.reset();
            this.returnList();
          },
          error => {
            this.messageService.error(error);
            this.progressBar = false;
          }
        ));
  }

  addActivity(data: string = '') {
    this.activitiesField.push(this.formBuilder.control(data, Validators.required));
  }

  removeActivity(index: number) {
    if (this.activitiesField.length > 1)
      this.activitiesField.removeAt(index);
    else
      this.messageService.errorRequired();
  }

  isRequired(field: AbstractControl): boolean {
    return field.hasValidator(Validators.required);
  }

  verifyWorkedValidators() {
    if (this.workedField.value) {
      this.endedAtField.setValidators([Validators.required]);
      this.reasonLeaveField.setValidators([Validators.required]);
    } else {
      this.endedAtField.clearValidators();
      this.endedAtField.setValue(null);
      this.reasonLeaveField.clearValidators();
      this.reasonLeaveField.setValue(null);
    }
    this.endedAtField.updateValueAndValidity();
    this.reasonLeaveField.updateValueAndValidity();
  }

  returnList() {
    this.router.navigate(['/job-board/professional', 3]);
  }

  get idField() {
    return this.form.controls['id'];
  }

  get areaField() {
    return this.form.controls['area'];
  }

  get activitiesField(): FormArray {
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
    return this.form.controls['reasonLeave'];
  }

  get startedAtField() {
    return this.form.controls['startedAt'];

  }

  get workedField() {
    return this.form.controls['worked'];
  }
}

