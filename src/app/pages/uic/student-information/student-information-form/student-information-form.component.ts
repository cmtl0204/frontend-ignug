import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {UicHttpService, UicService} from '@services/uic';
import {StudentInformationModel, CategoryModel,} from '@models/uic';
import { CatalogueModel } from '@models/core';
import { StudentModel } from '@models/uic/student-information.model';

@Component({
  selector: 'app-student-information-form',
  templateUrl: './student-information-form.component.html',
  styleUrls: ['./student-information-form.component.scss']
})

export class StudentInformationFormComponent implements OnInit, OnDestroy, OnExitInterface {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  loadingSkeleton: boolean = false;
  title: string = 'Crear Información de estudiante';
  buttonTitle: string = 'Crear Información de estudiante';
  students: StudentModel[] = [];
  relationLaboralCareers: CatalogueModel[] = [];
  companyAreas: CatalogueModel[] = [];
  companyPositions: CatalogueModel[] = [];
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
      {label: 'Formaciones Académicas', routerLink: ['/uic/professional/student-information'], disabled: true},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
    this.certificatedField.valueChanges.subscribe(value => {
      this.verifyCertificatedValidators();
    });
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar Información de estudiante';
      this.buttonTitle = 'Actualizar Información de estudiante';
      this.loadStudentInformation();
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
      student: [null, [Validators.required]],
      relationLaboralCareer: [false, [Validators.required]],
      companyArea: [null],
      companyPosition: [null],
      companyWork: [null],
    });
  }

  loadStudentInformation() {
    this.loadingSkeleton = true;
    this.subscriptions.push(
      this.uicHttpService
        .getStudentInformation(this.activatedRoute.snapshot.params.id)
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

  loadStudents() {
    this.subscriptions.push(
      this.uicHttpService.getStudents()
        .subscribe(
          response => {
            this.students = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  loadRelationLaboralCareers() {
    this.subscriptions.push(
      this.uicHttpService.getRelationLaboralCareers()
        .subscribe(
          response => {
            this.relationLaboralCareers = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  loadCompanyAreas() {
    this.subscriptions.push(
      this.uicHttpService.getCompanyAreas()
        .subscribe(
          response => {
            this.companyAreas = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  loadCompanyPositions() {
    this.subscriptions.push(
      this.uicHttpService.getCompanyPositions()
        .subscribe(
          response => {
            this.companyPositions = response.data;
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

  store(studentInformation: StudentInformationModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.uicHttpService.storeStudentInformation(studentInformation)
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

  update(studentInformation: StudentInformationModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.uicHttpService.updateStudentInformation(studentInformation.id!, studentInformation)
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

  get studentField() {
    return this.form.controls['student'];
  }

  get relationLaboralCareerField() {
    return this.form.controls['relationLaboralCareer'];
  }

  get companyAreaField() {
    return this.form.controls['companyArea'];
  }

  get companyPositionField() {
    return this.form.controls['companyPosition'];
  }
  
  get companyWorkField() {
    return this.form.controls['companyWork'];
  }
}

