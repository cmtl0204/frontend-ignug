import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {UicHttpService, UicService} from '@services/uic';
import {RequirementModel, CareerModel,} from '@models/uic';

@Component({
  selector: 'app-requirement-form',
  templateUrl: './requirement-form.component.html',
  styleUrls: ['./requirement-form.component.scss']
})

export class RequirementFormComponent implements OnInit, OnDestroy, OnExitInterface {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  loadingSkeleton: boolean = false;
  title: string = 'Crear Requerimiento';
  buttonTitle: string = 'Crear Requerimiento';
  career: CareerModel[] = [];
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
      {label: 'Requerimientos', routerLink: ['/uic/professional/requirement'], disabled: true},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
    this.certificatedField.valueChanges.subscribe(value => {
      this.verifyCertificatedValidators();
    });
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar Requerimiento';
      this.buttonTitle = 'Actualizar Requerimiento';
      this.loadRequirement();
    }
    this.loadCareers();
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
      career: [null,[Validators.required]],
      name: [null, [Validators.required]],
      required: [false],
      solicited: [false],
    });
  }

  loadRequirement() {
    this.loadingSkeleton = true;
    this.subscriptions.push(
      this.uicHttpService
        .getRequirement(this.activatedRoute.snapshot.params.id)
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

  loadCareers() {
    this.subscriptions.push(
      this.uicHttpService.getCareers()
        .subscribe(
          response => {
            this.careers = response.data;
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

  store(requirement: RequirementModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.uicHttpService.storeRequirement(requirement)
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

  update(requirement: RequirementModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.uicHttpService.updateRequirement(requirement.id!, requirement)
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

  get careerField() {
    return this.form.controls['career'];
  }

  get nameField() {
    return this.form.controls['name'];
  }

  get requiredField() {
    return this.form.controls['required'];
  }

  get solicitedField() {
    return this.form.controls['solicited'];
  }
}

