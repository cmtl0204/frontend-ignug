import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {BreadcrumbService} from "@services/core/breadcrumb.service";
import {CoreHttpService, CoreService, MessageService} from "@services/core";
import {JobBoardHttpService, JobBoardService} from "@services/job-board";
import {CategoryModel, ProfessionalModel} from "@models/job-board";
import {IdentificationValidator} from "@shared/validators/identification-validator";
import {CatalogueModel, ColModel, PaginatorModel} from "@models/core";
import {ColsService} from "@services/core/cols.service";

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
  yearRange: string = `1900:${(new Date()).getFullYear()}`;
  identificationTypes: CatalogueModel[] = [];
  sexes: CatalogueModel[] = [];
  genders: CatalogueModel[] = [];
  bloodTypes: CatalogueModel[] = [];
  ethnicOrigins: CatalogueModel[] = [];
  regExpAlpha: RegExp;
  displayModalSearch: boolean = false;
  colsSearchCatalogue: ColModel[] = [];
  recordsSearchCatalogue: CatalogueModel[] = [];
  selectedField: AbstractControl;
  selectedFieldText: string = '';
  paginatorSearch: PaginatorModel = {current_page: 1, per_page: 3, total: 0};
  loadingSearch: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private coreHttpService: CoreHttpService,
    private coreService: CoreService,
    private jobBoardHttpService: JobBoardHttpService,
    private jobBoardService: JobBoardService,
    private colsService: ColsService
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
    this.selectedField = new FormControl(null);

    this.familiarDisabledField.valueChanges.subscribe(value => {
      this.verifyFamiliarDisabledValidators();
    });

    this.identificationTypeUserField.valueChanges.subscribe(value => {
      this.verifyIdentificationTypeUserValidators();
    });

    this.regExpAlpha = coreService.alpha;
  }

  ngOnInit(): void {
    this.title = 'Actualizar Perfil';
    this.buttonTitle = 'Actualizar Perfil';
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
        username: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(20)]],
        sex: [null, [Validators.required]],
        gender: [null, [Validators.required]],
        ethnicOrigin: [null, [Validators.required]],
        bloodType: [null, [Validators.required]],
        name: [null, [Validators.required]],
        lastname: [null, [Validators.required]],
        birthdate: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        phone: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
      }),
      traveled: [null, [Validators.required]],
      disabled: [null, [Validators.required]],
      familiarDisabled: [null, [Validators.required]],
      identificationFamiliarDisabled: [null],
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
    this.loadingSearch = true;
    this.subscriptions.push(
      this.coreHttpService.getCatalogues2('IDENTIFICATION_PROFESSIONAL_TYPE', this.paginatorSearch)
        .subscribe(
          response => {
            this.loadingSearch = false;
            this.identificationTypes = response.data;
            this.recordsSearchCatalogue = response.data;
            this.paginatorSearch = response.meta;
          }, error => {
            this.loadingSearch = false;
            this.messageService.error(error);
          }
        ));
  }

  loadSexes() {
    this.loadingSearch = true;
    this.subscriptions.push(
      this.coreHttpService.getCatalogues2('SEX_TYPE', this.paginatorSearch)
        .subscribe(
          response => {
            this.loadingSearch = false;
            this.sexes = response.data;
            this.recordsSearchCatalogue = response.data;
            this.paginatorSearch = response.meta;
          }, error => {
            this.loadingSearch = false;
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
      this.update(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  update(professional: ProfessionalModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.jobBoardHttpService.updateProfile(professional.id!, professional)
        .subscribe(
          response => {
            this.messageService.success(response);
            this.form.patchValue(response.data);
            this.progressBar = false;
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
      this.usernameUserField.setValidators([IdentificationValidator.valid]);
    } else {
      this.usernameUserField.clearValidators();
    }
    this.usernameUserField.updateValueAndValidity();
  }

  showModalSearch(catalogues: CatalogueModel[], field: AbstractControl, fieldText: string) {
    this.selectedField = field;
    this.selectedFieldText = fieldText;
    this.recordsSearchCatalogue = catalogues;
    this.colsSearchCatalogue = this.colsService.catalogue;
    this.displayModalSearch = true;
    this.loadCatalogues();
  }

  loadSearchCatalogue(event: any) {
    this.selectedField.patchValue(event);
  }

  paginateSearch(event: any) {
    console.log(event);
    this.paginatorSearch = event;
    this.loadCatalogues();
  }

  loadCatalogues() {
    switch (this.selectedFieldText) {
      case 'identificationTypes':
        this.loadIdentificationTypes();
        break;
      case 'sexes':
        this.loadSexes();
        break;
      default:
        return;
    }
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
