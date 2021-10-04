import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {CoreHttpService} from '@services/core';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {CatalogueModel} from '@models/core';
import {LanguageModel} from '@models/job-board';

@Component({
  selector: 'app-language-form',
  templateUrl: './language-form.component.html',
  styleUrls: ['./language-form.component.scss']
})
export class LanguageFormComponent implements OnInit, OnDestroy, OnExitInterface {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  skeletonLoading: boolean = false;
  title: string = 'Idioma';
  buttonTitle: string = 'Idioma';

  idioms: CatalogueModel[] = [];
  writtenLevel: CatalogueModel[] = [];
  spokenLevels: CatalogueModel[] = [];
  readLevels: CatalogueModel[] = [];

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
      {label: 'Idiomas', routerLink: ['/job-board/professional/language']},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar idioma';
      this.buttonTitle = 'Actualizar idioma';
      this.loadLanguage();
      this.form.markAllAsTouched();
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
      return await this.messageService.questionOnExit({}).then((result) => {
        return result.isConfirmed;
      });
    }
    return true;
  }

  newForm(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      professional: [null, [Validators.required]],
      idiom: [null, [Validators.required]],
      writtenLevel: [null, [Validators.required]],
      spokenLevel: [null, [Validators.required]],
      readLevel: [null, [Validators.required]],
    });
  }

  loadLanguage():void {
    this.skeletonLoading = true;
    this.subscriptions.push(
      this.jobBoardHttpService
        .getLanguage(this.jobBoardService.professional.id!, this.activatedRoute.snapshot.params.id)
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
// Foreingkeys
  loadIdioms() {
    this.coreHttpService.getCatalogues('IDIOM').subscribe(
      response => {
        this.idioms = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  loadWrittenLevels() {
    this.coreHttpService.getCatalogues('COURSE_EVENT_TYPE').subscribe(
      response => {
        this.writtenLevel = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  loadSpokenLevels() {
    this.coreHttpService.getCatalogues('COURSE_EVENT_TYPE').subscribe(
      response => {
        this.spokenLevels = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  loadReadLevels() {
    this.coreHttpService.getCatalogues('NIVELES_DE_LECTURA').subscribe(
      response => {
        this.readLevels = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
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
    this.jobBoardHttpService.storeLanguage(language, this.jobBoardService.professional.id!).subscribe(
      response => {
        this.messageService.success(response);
        this.progressBar = false;
        this.form.reset();
        this.router.navigate(['/job-board/professional/language']);
      },
      error => {
        this.messageService.error(error);
        this.progressBar = false;
      }
    );
  }

  update(language: LanguageModel): void {
    this.progressBar = true;
    this.jobBoardHttpService.updateLanguage(language.id!, language, this.jobBoardService.professional.id!).subscribe(
      response => {
        this.messageService.success(response);
        this.form.reset();
        this.progressBar = false;
        this.router.navigate(['/job-board/professional/language']);
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

