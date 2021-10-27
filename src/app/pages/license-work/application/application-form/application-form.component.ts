import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocationModel, CatalogueModel} from '@models/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BreadcrumbService} from "@services/core/breadcrumb.service";
import {MessageService} from "@services/core";
import {LicenseWorkHttpService, LicenseWorkService} from "@services/license-work";
import {ApplicationModel} from "@models/license-work";


@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  loadingSkeleton: boolean = false;
  title: string = 'Crear Solicitud';
  buttonTitle: string = 'Crear Solicitud';

  employees: EmployeeModel[] = [];
  forms: FormModel[] = [];
  reasons: ReasonModel[] = [];
  locations: LocationModel[] = [];
  types: CatalogueModel[] = [];

  //yearRange: string = `1900:${(new Date()).getFullYear()}`;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private licenseWorkHttpService: LicenseWorkHttpService,
    private licenseWorkService: LicenseWorkService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Solicitud', disabled: true},
    ]);
    this.form = this.newForm();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar Solicitud';
      this.buttonTitle = 'Actualizar Solicitud';
      this.loadApplication();
    }
    this.loadEmployees();
    this.loadForms();
    this.loadReasons();
    this.loadLocations();
    this.loadTypes();
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
      employee: [null, [Validators.required]],
      form: [null, [Validators.required]],
      reason: [null, [Validators.required]],
      location: [null, [Validators.required]],
      type: [null, [Validators.required]],
      dateStartedAt: [null, [Validators.required]],
      dateEndedAt: [null, [Validators.required]],
      timeStartedAt: [null, [Validators.required]],
      timeEndedAt: [null, [Validators.required]],
      observations: [null],
    });
  }
  loadApplication() {
    this.loadingSkeleton = true;
    this.subscriptions.push(
      this.licenseWorkHttpService
        .getApplication(this.licenseWorkService.professional.id!)
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

  loadEmployees() {
    this.subscriptions.push(
      this.licenseWorkHttpService.getEmployees()
        .subscribe(
          response => {
            this.employees = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }
  loadForms() {
    this.subscriptions.push(
      this.licenseWorkHttpService.getForms()
        .subscribe(
          response => {
            this.forms = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }
  loadReasons() {
    this.subscriptions.push(
      this.licenseWorkHttpService.getReasons()
        .subscribe(
          response => {
            this.reasons = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }
  loadLocations() {
    this.subscriptions.push(
      this.licenseWorkHttpService.getLocations()
        .subscribe(
          response => {
            this.locations = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }
  loadTypes() {
    this.subscriptions.push(
      this.licenseWorkHttpService.getTypes()
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

  store(application: ApplicationModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.licenseWorkHttpService.storeApplication(application)
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

  update(application: ApplicationModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.licenseWorkHttpService.updateApplication(application.id!, application)
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
  isRequired(field: AbstractControl): boolean {
    return field.hasValidator(Validators.required);
  }
  returnList() {
    this.router.navigate(['/license-work', 2]);
  }

  get idField() {
    return this.form.controls['id'];
  }
  get employeeField() {
    return this.form.controls['employee'];
  }
  get formField() {
    return this.form.controls['form'];
  }
  get reasonField() {
    return this.form.controls['reason'];
  }
  get locationField() {
    return this.form.controls['location'];
  }
  get typeField() {
    return this.form.controls['type'];
  }
  get dateStartedAtField() {
    return this.form.controls['dateStartedAt'];
  }
  get dateEndedAtField() {
    return this.form.controls['dateEndedAt'];
  }
  get timeStartedAtField() {
    return this.form.controls['timeStartedAt'];
  }
  get timeEndedAtField() {
    return this.form.controls['timeEndedAt'];
  }
  get observationsField() {
    return this.form.controls['observations'];
  }
}

