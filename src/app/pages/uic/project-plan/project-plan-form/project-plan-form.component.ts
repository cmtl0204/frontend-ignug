import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {UicHttpService, UicService} from '@services/uic';
import {ProjectPlanModel, CategoryModel,} from '@models/uic';

@Component({
  selector: 'app-project-plan-form',
  templateUrl: './project-plan-form.component.html',
  styleUrls: ['./project-plan-form.component.scss']
})

export class AcademicFormationFormComponent implements OnInit, OnDestroy, OnExitInterface {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  loadingSkeleton: boolean = false;
  title: string = 'Crear Plan de Proyecto';
  buttonTitle: string = 'Crear Plan de Proyecto';
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
      {label: 'Planes de Proyectos', routerLink: ['/uic/professional/project-plan'], disabled: true},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
    this.certificatedField.valueChanges.subscribe(value => {
      this.verifyCertificatedValidators();
    });
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar Plan de Proyecto';
      this.buttonTitle = 'Actualizar Plan de Proyecto';
      this.loadProjectPlan();
    }
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
      title: [null],
      description: [null],
      actCode: [null],
      approvedAt: [null],
      approved: [null],
      observations: [null],
    });
  }

  loadProjectPlan() {
    this.loadingSkeleton = true;
    this.subscriptions.push(
      this.uicHttpService
        .getProjectPlan( this.activatedRoute.snapshot.params.id)
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

 /*/ loadProfessionalDegrees() {
    this.subscriptions.push(
      this.jobBoardHttpService.getProfessionalDegrees()
        .subscribe(
          response => {
            this.professionalDegrees = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }/*/

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

  store(projectPlan: ProjectPlanModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.uicHttpService.storeProjectPlan(projectPlan)
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

  update(projectPlan: ProjectPlanModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.uicHttpService.updateProjectPlan(projectPlan.id!, projectPlan)
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

  /*/verifyCertificatedValidators() {
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
  }/*/

  isRequired(field: AbstractControl): boolean {
    return field.hasValidator(Validators.required);
  }

  returnList() {
    this.router.navigate(['/uic/professional', 2]);
  }

  get idField() {
    return this.form.controls['id'];
  }

  get titleField() {
    return this.form.controls['title'];
  }

  get descriptionField() {
    return this.form.controls['description'];
  }

  get actCodeField() {
    return this.form.controls['actCode'];
  }

  get approvedAtField() {
    return this.form.controls['approvedAt'];
  }
  get approvedField() {
    return this.form.controls['approved'];
  }
  get observationsField() {
    return this.form.controls['observations'];
  }
}

