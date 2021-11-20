import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryModel, ProfessionalModel} from "@models/job-board";
import {ActivatedRoute, Router} from "@angular/router";
import {BreadcrumbService} from "@services/core/breadcrumb.service";
import {AuthHttpService, CoreHttpService, CoreService, MessageService} from "@services/core";
import {JobBoardHttpService, JobBoardService} from "@services/job-board";
import {IdentificationValidator} from "@shared/validators/identification-validator";
import {CustomValidators} from "@shared/validators/custom-validators";

@Component({
  selector: 'app-professional-registration',
  templateUrl: './professional-registration.component.html',
  styleUrls: ['./professional-registration.component.scss']
})
export class ProfessionalRegistrationComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  skeletonLoading: boolean = false;
  title: string = 'Crear';
  buttonTitle: string = 'Crear';
  yearRange: string = `1900:${(new Date()).getFullYear()}`;
  identificationTypes: CategoryModel[] = [];
  sexes: CategoryModel[] = [];
  genders: CategoryModel[] = [];
  bloodTypes: CategoryModel[] = [];
  ethnicOrigins: CategoryModel[] = [];
  regExpAlpha: RegExp;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private authHttpService: AuthHttpService,
    private coreHttpService: CoreHttpService,
    private coreService: CoreService,
    private jobBoardHttpService: JobBoardHttpService
  ) {
    this.form = this.newForm();

    this.familiarDisabledField.valueChanges.subscribe(value => {
      this.verifyFamiliarDisabledValidators();
    });

    this.identificationTypeUserField.valueChanges.subscribe(value => {
      this.verifyIdentificationTypeUserValidators();
    });

    this.regExpAlpha = coreService.alpha;
  }

  ngOnInit(): void {
    this.title = 'Registrar';
    this.buttonTitle = 'Registrar';

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
        username: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(20)], CustomValidators.verifyUser(this.authHttpService)],
        password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(16)]],
        passwordConfirmation: [null, [Validators.required]],
        sex: [null, [Validators.required]],
        gender: [null, [Validators.required]],
        ethnicOrigin: [null, [Validators.required]],
        bloodType: [null, [Validators.required]],
        name: [null, [Validators.required]],
        lastname: [null, [Validators.required]],
        birthdate: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email], CustomValidators.verifyEmail(this.authHttpService)],
        phone: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)], CustomValidators.verifyPhone(this.authHttpService)]
      }, {validators: CustomValidators.passwordMatchValidator}),
      traveled: [false, [Validators.required]],
      disabled: [false, [Validators.required]],
      familiarDisabled: [false, [Validators.required]],
      identificationFamiliarDisabled: [null],
      catastrophicDiseased: [false, [Validators.required]],
      familiarCatastrophicDiseased: [false, [Validators.required]],
      aboutMe: [null, [Validators.required, Validators.minLength(100), Validators.maxLength(300)]],
    });
  }

  loadIdentificationTypes() {
    this.subscriptions.push(
      this.coreHttpService.getCatalogues('IDENTIFICATION_PROFESSIONAL_TYPE')
        .subscribe(
          response => {
            this.identificationTypes = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  loadSexes() {
    this.subscriptions.push(
      this.coreHttpService.getCatalogues('SEX_TYPE')
        .subscribe(
          response => {
            this.sexes = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  loadGenders() {
    this.subscriptions.push(
      this.coreHttpService.getCatalogues('GENDER_TYPE')
        .subscribe(
          response => {
            this.genders = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  loadBloodTypes() {
    this.subscriptions.push(
      this.coreHttpService.getCatalogues('BLOOD_TYPE')
        .subscribe(
          response => {
            this.bloodTypes = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  loadEthnicOrigins() {
    this.subscriptions.push(
      this.coreHttpService.getCatalogues('ETHNIC_ORIGIN_TYPE')
        .subscribe(
          response => {
            this.ethnicOrigins = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.registration(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  registration(professional: ProfessionalModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.jobBoardHttpService.registrationProfessional(professional)
        .subscribe(
          response => {
            this.messageService.success(response);
            this.progressBar = false;
            // this.router.navigate(['/authentication/login']);
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

  verifyFamiliarDisabledValidators() {
    if (this.familiarDisabledField.value) {
      this.identificationFamiliarDisabledField.setValidators([Validators.required]);
    } else {
      this.identificationFamiliarDisabledField.clearValidators();
      this.identificationFamiliarDisabledField.setValue(null);
    }
    this.identificationFamiliarDisabledField.updateValueAndValidity();
  }

  verifyIdentificationTypeUserValidators() {
    if (this.identificationTypeUserField.value.code === 'CC') {
      this.usernameUserField.setValidators([Validators.required, IdentificationValidator.valid]);
    } else {
      this.usernameUserField.setValidators(Validators.required);
    }
    this.usernameUserField.updateValueAndValidity();
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
    return this.form.controls['user'].get('username')!;
  }

  get passwordUserField() {
    return this.form.controls['user'].get('password')!;
  }

  get passwordConfirmationUserField() {
    return this.form.controls['user'].get('passwordConfirmation')!;
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

  get familiarDisabledField() {
    return this.form.controls['familiarDisabled'];
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
