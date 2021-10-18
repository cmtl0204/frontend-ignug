import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {AcademicFormationModel, CategoryModel,} from '@models/job-board';

@Component({
  selector: 'app-academic-formation-form',
  templateUrl: './academic-formation-form.component.html',
  styleUrls: ['./academic-formation-form.component.scss']
})

export class AcademicFormationFormComponent implements OnInit, OnDestroy, OnExitInterface {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  professionalDegrees: CategoryModel[] = [];
  skeletonLoading: boolean = false;
  title: string = 'Crear Formación Académica';
  buttonTitle: string = 'Crear Formación Académica';
  yearRange: string = `1900:${(new Date()).getFullYear()}`;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private jobBoardHttpService: JobBoardHttpService,
    private jobBoardService: JobBoardService
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Formaciones Académicas', routerLink: ['/job-board/professional/academic-formation'], disabled: true},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
    this.certificatedField.valueChanges.subscribe(value => {
      this.verifyCertificatedValidators();
    });
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar Formación Académica';
      this.buttonTitle = 'Actualizar Formación Académica';
      this.loadAcademicFormation();
    }
    this.loadProfessionalDegrees();
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
      professionalDegree: [null, [Validators.required]],
      certificated: [false, [Validators.required]],
      senescytCode: [null],
      registeredAt: [null],
    });
  }

  loadAcademicFormation() {
    this.skeletonLoading = true;
    this.subscriptions.push(
      this.jobBoardHttpService
        .getAcademicFormation(this.jobBoardService.professional.id!, this.activatedRoute.snapshot.params.id)
        .subscribe(
          response => {
            this.form.patchValue(response.data);
            this.skeletonLoading = false;
          }, error => {
            this.skeletonLoading = false;
            this.messageService.error(error);
          }
        ));
  }

  loadProfessionalDegrees() {
    this.subscriptions.push(
      this.jobBoardHttpService.getProfessionalDegrees()
        .subscribe(
          response => {
            this.professionalDegrees = response.data;
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

  store(academicFormation: AcademicFormationModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.jobBoardHttpService.storeAcademicFormation(academicFormation, this.jobBoardService.professional.id!)
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

  update(academicFormation: AcademicFormationModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.jobBoardHttpService.updateAcademicFormation(academicFormation.id!, academicFormation, this.jobBoardService.professional.id!)
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
    this.router.navigate(['/job-board/professional', 2]);
  }

  get idField() {
    return this.form.controls['id'];
  }

  get professionalDegreeField() {
    return this.form.controls['professionalDegree'];
  }

  get registeredAtField() {
    return this.form.controls['registeredAt'];
  }

  get senescytCodeField() {
    return this.form.controls['senescytCode'];
  }

  get certificatedField() {
    return this.form.controls['certificated'];
  }
}

