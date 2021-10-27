import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {CoreHttpService} from '@services/core';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {CatalogueModel, FileModel, PaginatorModel} from '@models/core';
import {LanguageModel} from '@models/job-board';

@Component({
  selector: 'app-language-form',
  templateUrl: './language-form.component.html',
  styleUrls: ['./language-form.component.scss']
})

export class LanguageFormComponent implements OnInit, OnDestroy, OnExitInterface {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  formId: string;
  progressBar: boolean = false;
  loadingSkeleton: boolean = false;
  title: string = 'Crear Idioma';
  buttonTitle: string = 'Crear Idioma';
  idioms: CatalogueModel[] = [];
  writtenLevels: CatalogueModel[] = [];
  spokenLevels: CatalogueModel[] = [];
  readLevels: CatalogueModel[] = [];
  loadingUploadFiles: boolean = false;
  loadingFiles: boolean = false;
  files: FileModel[] = [];
  displayModalFiles: boolean = false;
  paginatorFiles: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filterFiles: FormControl;

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
      {label: 'Idiomas', routerLink: ['/job-board/professional/language'], disabled: true},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
    this.formId = this.activatedRoute.snapshot.params.id;
    this.filterFiles = new FormControl(null);
  }

  ngOnInit(): void {
    if (this.formId != 'new') {
      this.title = 'Actualizar Idioma';
      this.buttonTitle = 'Actualizar Idioma';
      this.loadLanguage();

    }
    this.loadIdioms();
    this.loadWrittenLevels();
    this.loadSpokenLevels();
    this.loadReadLevels();
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
      idiom: [null, [Validators.required]],
      writtenLevel: [null, [Validators.required]],
      spokenLevel: [null, [Validators.required]],
      readLevel: [null, [Validators.required]],
    });
  }

  loadLanguage(): void {
    this.loadingSkeleton = true;
    this.subscriptions.push(
      this.jobBoardHttpService
        .getLanguage(this.jobBoardService.professional.id!, this.activatedRoute.snapshot.params.id)
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

  loadFiles() {
    if (this.formId != 'new') {
      this.loadingFiles = true;
      this.subscriptions.push(
        this.coreHttpService.getFiles(`/language/${this.idField.value}/file`, this.paginatorFiles,this.filterFiles.value)
          .subscribe(
            response => {
              this.files = response.data;
              this.paginatorFiles = response.meta;
              this.loadingFiles = false;
            }, error => {
              this.messageService.error(error);
              this.loadingFiles = false;
            }
          ));
    }
  }

  loadIdioms() {
    this.subscriptions.push(
      this.coreHttpService.getCatalogues('LANGUAGE_IDIOM')
        .subscribe(
          response => {
            this.idioms = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  loadWrittenLevels() {
    this.subscriptions.push(
      this.coreHttpService.getCatalogues('LANGUAGE_WRITTEN_LEVEL')
        .subscribe(
          response => {
            this.writtenLevels = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  loadSpokenLevels() {
    this.subscriptions.push(
      this.coreHttpService.getCatalogues('LANGUAGE_SPOKEN_LEVEL')
        .subscribe(
          response => {
            this.spokenLevels = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  loadReadLevels() {
    this.subscriptions.push(
      this.coreHttpService.getCatalogues('LANGUAGE_READ_LEVEL')
        .subscribe(
          response => {
            this.readLevels = response.data;
          }, error => {
            this.messageService.error(error);
          }
        ));
  }

  onSubmit() {
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

  store(language: LanguageModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.jobBoardHttpService.storeLanguage(language, this.jobBoardService.professional.id!)
        .subscribe(
          response => {
            this.messageService.success(response);
            this.progressBar = false;
            this.form.reset();
            this.returnList();
          },
          error => {
            this.messageService.error(error);
            this.progressBar = false;
          }
        ));
  }

  update(language: LanguageModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.jobBoardHttpService.updateLanguage(language.id!, language, this.jobBoardService.professional.id!)
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
    this.router.navigate(['/job-board/professional', 6]);
  }

  uploadFile(event: any) {
    const formData = new FormData();
    for (const file of event) {
      formData.append('files[]', file);
    }
    this.loadingUploadFiles = true;
    this.coreHttpService.uploadFiles(`/language/${this.idField.value}/file`, formData)
      .subscribe(response => {
        this.loadingUploadFiles = false;
        this.loadFiles();
      }, error => {
        this.loadingUploadFiles = false;
        this.messageService.error(error);
      });
  }

  showModalFiles() {
    this.loadFiles();
    this.displayModalFiles = true;
  }

  get idField() {
    return this.form.controls['id'];
  }

  get idiomField() {
    return this.form.controls['idiom'];
  }

  get writtenLevelField() {
    return this.form.controls['writtenLevel'];
  }

  get spokenLevelField() {
    return this.form.controls['spokenLevel'];
  }

  get readLevelField() {
    return this.form.controls['readLevel'];
  }
}

