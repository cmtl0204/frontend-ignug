import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryModel, ProfessionalModel} from "@models/job-board";
import {ActivatedRoute, Router} from "@angular/router";
import {BreadcrumbService} from "@services/core/breadcrumb.service";
import {CoreHttpService, MessageService} from "@services/core";
import {JobBoardHttpService, JobBoardService} from "@services/job-board";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  skeletonLoading: boolean = false;
  title: string = 'Crear';
  buttonTitle: string = 'Crear';

  identificationTypes: CategoryModel[] = [];
  sexes: CategoryModel[] = [];
  genders: CategoryModel[] = [];
  bloodTypes: CategoryModel[] = [];
  ethnicOrigins: CategoryModel[] = [];

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
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
  }

  ngOnInit(): void {
    this.title = 'Actualizar';
    this.buttonTitle = 'Actualizar';
    this.loadProfile();

    this.loadIdentificationTypes();
    this.loadSexes();
    this.loadGenders();
    this.loadBloodTypes();
    this.loadEthnicOrigins();
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
      user: this.formBuilder.group({
        id: [null],
        identificationType: [null, [Validators.required]],
        sex: [null, [Validators.required]],
        gender: [null, [Validators.required]],
        ethnicOrigin: [null, [Validators.required]],
        bloodType: [null, [Validators.required]],
        username: [null, [Validators.required]],
        name: [null, [Validators.required]],
        lastname: [null, [Validators.required]],
        birthdate: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        phone: [null]
      }),
      traveled: [null, [Validators.required]],
      disabled: [null, [Validators.required]],
      familiarDisabled: [null, [Validators.required]],
      identificationFamiliarDisabled: [null, [Validators.required]],
      catastrophicDiseased: [null, [Validators.required]],
      familiarCatastrophicDiseased: [null, [Validators.required]],
      aboutMe: [null, [Validators.required, Validators.minLength(100), Validators.maxLength(300)]],
    });
  }

  loadProfile() {
    this.skeletonLoading = true;
    this.subscriptions.push(
      this.jobBoardHttpService
        .getProfile(this.jobBoardService.professional.id!)
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

  loadIdentificationTypes() {
    this.coreHttpService.getCatalogues('IDENTIFICATION_TYPE')
      .subscribe(
        response => {
          this.identificationTypes = response.data;
        }, error => {
          this.messageService.error(error);
        }
      );
  }

  loadSexes() {
    this.coreHttpService.getCatalogues('SEX_TYPE')
      .subscribe(
        response => {
          this.sexes = response.data;
        }, error => {
          this.messageService.error(error);
        }
      );
  }

  loadGenders() {
    this.coreHttpService.getCatalogues('GENDER_TYPE')
      .subscribe(
        response => {
          this.genders = response.data;
        }, error => {
          this.messageService.error(error);
        }
      );
  }

  loadBloodTypes() {
    this.coreHttpService.getCatalogues('BLOOD_TYPE')
      .subscribe(
        response => {
          this.bloodTypes = response.data;
        }, error => {
          this.messageService.error(error);
        }
      );
  }

  loadEthnicOrigins() {
    this.coreHttpService.getCatalogues('ETHNIC_ORIGIN_TYPE')
      .subscribe(
        response => {
          this.ethnicOrigins = response.data;
        }, error => {
          this.messageService.error(error);
        }
      );
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.update(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  update(professional: ProfessionalModel): void {
    this.progressBar = true;
    this.jobBoardHttpService.updateProfile(professional.id!, professional).subscribe(
      response => {
        this.messageService.success(response);
        this.form.reset();
        this.progressBar = false;
      },
      error => {
        this.messageService.error(error);
        this.progressBar = false;
      }
    );
  }

  get idField() {
    return this.form.controls['id'];
  }

  get identificationTypeUserField() {
    return this.form.controls['user'].get('identificationType')!;
  }

  get sexUserField() {
    return this.form.controls['user'].get('sex')!;
  }

  get genderUserField() {
    return this.form.controls['user'].get('gender')!;
  }

  get bloodTypeUserField() {
    return this.form.controls['user'].get('bloodType')!;
  }

  get ethnicOriginUserField() {
    return this.form.controls['user'].get('ethnicOrigin')!;
  }

  get usernameUserField() {
    return this.form.controls['user'].get('identificationType')!;
  }

  get nameUserField() {
    return this.form.controls['user'].get('name')!;
  }

  get lastnameUserField() {
    return this.form.controls['user'].get('lastname')!;
  }

  get emailUserField() {
    return this.form.controls['user'].get('email')!;
  }

  get phoneUserField() {
    return this.form.controls['user'].get('phone')!;
  }

  get birthdateUserField() {
    return this.form.controls['user'].get('birthdate')!;
  }

  get traveledField() {
    return this.form.controls['traveled'];
  }

  get disabledField() {
    return this.form.controls['disabled'];
  }

  get identificationFamiliarDisabledField() {
    return this.form.controls['identificationFamiliarDisabled'];
  }

  get catastrophicDiseasedField() {
    return this.form.controls['catastrophicDiseased'];
  }

  get familiarCatastrophicDiseasedField() {
    return this.form.controls['familiarCatastrophicDiseased'];
  }

  get aboutMeField() {
    return this.form.controls['aboutMe'];
  }
}
