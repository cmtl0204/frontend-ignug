import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {UicHttpService, UicService} from '@services/uic';
import {MeshStudentRequirementModel, CategoryModel,} from '@models/uic';

@Component({
  selector: 'app-mesh-student-requirement-form',
  templateUrl: './mesh-student-requirement-form.component.html',
  styleUrls: ['./mesh-student-requirement-form.component.scss']
})

export class MeshStudentRequirementFormComponent implements OnInit, OnDestroy, OnExitInterface {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  loadingSkeleton: boolean = false;
  title: string = 'Crear Requerimiento';
  buttonTitle: string = 'Crear Requerimiento';
  meshStudents: CategoryModel[] = [];
  requirements: CategoryModel[] = [];
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
      {label: 'Requisitos para la malla curricular', routerLink: ['/uic/professional/mesh-student-requirement'], disabled: true},
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
      this.loadMeshStudentRequirement();
    }
    this.loadMeshStudentRequirements();
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
      meshStudent: [null, [Validators.required]],
      requirement: [null, [Validators.required]],
      approved: [false],
      observations: [null],
    });
  }

  loadMeshStudentRequirement() {
    this.loadingSkeleton = true;
    this.subscriptions.push(
      this.uicHttpService
        .getMeshStudentRequirement(this.activatedRoute.snapshot.params.id)
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

  loadMeshStudents() {
    this.subscriptions.push(
      this.uicHttpService.getMeshStudents()
        .subscribe(
          response => {
            this.meshStudents = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  loadRequirements() {
    this.subscriptions.push(
      this.uicHttpService.getRequirements()
        .subscribe(
          response => {
            this.requirements = response.data;
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

  store(meshStudentRequirement: MeshStudentRequirementModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.uicHttpService.storeMeshStudentRequirement(meshStudentRequirement)
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

  update(meshStudentRequirement: MeshStudentRequirementModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.uicHttpService.updateMeshStudentRequirement(meshStudentRequirement.id!, meshStudentRequirement)
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

  get meshStudentField() {
    return this.form.controls['meshStudent'];
  }

  get requirementAtField() {
    return this.form.controls['requirement'];
  }

  get approvedField() {
    return this.form.controls['approved'];
  }

  get observationsField() {
    return this.form.controls['observations'];
  }
}

