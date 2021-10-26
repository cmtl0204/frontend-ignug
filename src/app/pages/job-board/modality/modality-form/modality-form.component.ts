import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {uicHttpService, uicService} from '@services/job-board';
import {ModalityModel, CategoryModel,} from '@models/job-board';

@Component({
  selector: 'app-modality-form',
  templateUrl: './modality-form.component.html',
  styleUrls: ['./modality-form.component.scss']
})

export class ModalityFormComponent implements OnInit, OnDestroy, OnExitInterface {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  parent: CategoryModel[] = [];
  state: CategoryModel[] = [];
  skeletonLoading: boolean = false;
  title: string = 'Crear Modalidad';
  buttonTitle: string = 'Crear Modalidad';
  yearRange: string = `1900:${(new Date()).getFullYear()}`;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private uicdHttpService: JobBoardHttpService,
    private uicService: JobBoardService
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Modalidad', routerLink: ['/job-board/professional/academic-formation'], disabled: true},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
    this.certificatedField.valueChanges.subscribe(value => {
      this.verifyCertificatedValidators();
    });
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar Modalidad';
      this.buttonTitle = 'Actualizar Modalidad';
      this.loadModality();
    }
    this.loadparent();
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

  loadModality() {
    this.skeletonLoading = true;
    this.subscriptions.push(
      this.uicHttpService
        .getModality(this.activatedRoute.snapshot.params.id)
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

  loadParent() {
    this.subscriptions.push(
      this.uicHttpService.getparent()
        .subscribe(
          response => {
            this.parent = response.data;
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

  store(modality: ModalityModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.uicHttpService.storeModality(modality)
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

  update(modality: ModalityModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.uicHttpService.updateModality(modality.id!, modality)
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

  get parentField() {
    return this.form.controls['parent'];
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

