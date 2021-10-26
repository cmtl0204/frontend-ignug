import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {UicHttpService, UicService} from '@services/uic';
import {TutorModel, CatalogueModel, ProjectPlanModel,TeacherModel} from '@models/uic';

@Component({
  selector: 'app-tutor-form',
  templateUrl: './tutor-form.component.html',
  styleUrls: ['./tutor-form.component.scss']
})

export class TutorFormComponent implements OnInit, OnDestroy, OnExitInterface {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  loadingSkeleton: boolean = false;
  title: string = 'Crear Tutor';
  buttonTitle: string = 'Crear Tutor';
  projectPlans: ProjectPlanModel[] = [];
  teacher: TeacherModel[] = [];
  types: CatalogueModel[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private uicHttpService: UicHttpService,
    private uicService: UicService
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Tutores', routerLink: ['/uic/professional/tutor'], disabled: true},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
    this.certificatedField.valueChanges.subscribe(value => {
      this.verifyCertificatedValidators();
    });
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar Tutor';
      this.buttonTitle = 'Actualizar Tutor';
      this.loadTutor();
    }
    this.projectPlans();
    this.teachers();
    this.types();
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
      projectPlan: [null, [Validators.required]],
      teacher: [null],
      type: [null],
      observations: [null, [Validators.required]],
    });
  }

  loadTutor() {
    this.loadingSkeleton = true;
    this.subscriptions.push(
      this.uicHttpService
        .getTutor(this.activatedRoute.snapshot.params.id)
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

  loadProjectPlans() {
    this.subscriptions.push(
      this.uicHttpService.getProjectPlans()
        .subscribe(
          response => {
            this.projectPlans = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  loadTeachers() {
    this.subscriptions.push(
      this.uicHttpService.getTeachers()
        .subscribe(
          response => {
            this.projectPlans = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  loadTypes() {
    this.subscriptions.push(
      this.uicHttpService.getCatalogues()
        .subscribe(
          response => {
            this.types = response.data;
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

  store(tutor: TutorModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.uicHttpService.storeTutor(tutor)
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

  update(tutor: TutorModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.uicHttpService.updateTutor(tutor.id!, tutor)
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

  verifyCertificatedValidators() {
    if (this.certificatedField.value) {
      this.senescytCodeField.setValidators([Validators.required]);
      this.registeredAtField.setValidators([Validators.required]);
    } else {
      this.senescytCodeField.clearValidators();
      this.senescytCodeField.setValue(null);
      this.registeredAtField.clearValidators();
      this.registeredAtField.setValue(null);
    }
    this.senescytCodeField.updateValueAndValidity();
    this.registeredAtField.updateValueAndValidity();
  }

  isRequired(field: AbstractControl): boolean {
    return field.hasValidator(Validators.required);
  }

  returnList() {
    this.router.navigate(['/uic/professional', 2]);
  }

  get idField() {
    return this.form.controls['id'];
  }

  get projectPlanField() {
    return this.form.controls['projectPlan'];
  }

  get teacherField() {
    return this.form.controls['teacher'];
  }

  get typeField() {
    return this.form.controls['type'];
  }

  get observationsField() {
    return this.form.controls['observations'];
  }
}



