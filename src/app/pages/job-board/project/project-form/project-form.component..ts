import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {UicHttpService, UicService} from '@services/uic';
import {ProjectModel, CategoryModel,} from '@models/uic';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})

export class ProjectFormComponent implements OnInit, OnDestroy, OnExitInterface {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  loadingSkeleton: boolean = false;
  title: string = 'Crear Proyecto';
  buttonTitle: string = 'Crear Proyecto';
  enrollments: CategoryModel[] = [];
  yearRange: string = `1900:${(new Date()).getFullYear()}`;

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
      {label: 'Profesional', routerLink: ['/uic/professional']},
      {label: 'Proyectos', routerLink: ['/uic/professional/project'], disabled: true},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
    this.certificatedField.valueChanges.subscribe(value => {
      this.verifyCertificatedValidators();
    });
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar Proyecto';
      this.buttonTitle = 'Actualizar Proyecto';
      this.loadProyecto();
    }
    this.loadenrollments();
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
      enrollment: [null, [Validators.required]],
      projectPlan: [false, [Validators.required]],
      title: [null],
      description: [null],
      total_advance: [null],
      approved: [null],
      tutor_asigned: [null],
      observations: [null],
    });
  }

  loadProject() {
    this.loadingSkeleton = true;
    this.subscriptions.push(
      this.uicHttpService
        .getProject(this.uicService.professional.id!, this.activatedRoute.snapshot.params.id)
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

  loadEnrollments() {
    this.subscriptions.push(
      this.uicHttpService.getEnrollents()
        .subscribe(
          response => {
            this.enrollments = response.data;
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

  store(project: ProjectModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.uicHttpService.storeProject(project, this.uicService.professional.id!)
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

  update(project: ProjectModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.uicHttpService.updateProject(project.id!, project, this.uicService.professional.id!)
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

  get enrollmentField() {
    return this.form.controls['enrollment'];
  }

  get rojectPlanField() {
    return this.form.controls['projectPlan'];
  }

  get titleField() {
    return this.form.controls['title'];
  }

  get descriptionField() {
    return this.form.controls['description'];
  }
  get scoreField() {
    return this.form.controls['score'];
  }
  get totalAdvanceField() {
    return this.form.controls['total_advance'];
  }
  get approvedField() {
    return this.form.controls['approved'];
  }
  get tutorAsignedField() {
    return this.form.controls['tutor_asigned'];
  }
  get observationsField() {
    return this.form.controls['observations'];
  }
}

