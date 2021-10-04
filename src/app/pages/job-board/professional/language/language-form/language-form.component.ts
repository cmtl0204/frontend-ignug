import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {CatalogueModel, UserModel} from '@models/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserAdministrationHttpService} from '@services/core/user-administration-http.service';
import {MessageService} from '@services/core';
import {ActivatedRoute, Router} from '@angular/router';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {LanguageModel} from '@models/job-board';
import {AppService} from '@services/core/app.service';
import {Subscription} from 'rxjs';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';

@Component({
  selector: 'app-language-form',
  templateUrl: './language-form.component.html',
  styleUrls: ['./language-form.component.scss']
})
export class LanguageFormComponent implements OnInit, OnDestroy, OnExitInterface {
  @Input() user: UserModel = {};
  @Output() userNewOrUpdate = new EventEmitter<UserModel>();

  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  types: CatalogueModel[] = [];
  certificationTypes: CatalogueModel[] = [];
  areas: CatalogueModel[] = [];
  skeletonLoading: boolean = false;
  title: string = 'Crear evento';
  buttonTitle: string = 'Crear evento';

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private formBuilder: FormBuilder,
    private userAdministrationHttpService: UserAdministrationHttpService,
    private jobBardHttpService: JobBoardHttpService,
    private jobBardService: JobBoardService,
    private appService: AppService,
    public messageService: MessageService,
    private activatedRoute: ActivatedRoute) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Cursos y Capacitaciones', routerLink: ['/job-board/professional/course']},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar evento';
      this.buttonTitle = 'Actualizar evento';
      this.getLanguage();
      this.form.markAllAsTouched();
    }
    this.getCertificationType();
    this.getTypes();
    this.getAreas();
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

  getLanguage() {
    this.skeletonLoading = true;
    this.subscriptions.push(this.jobBardHttpService.getLanguage(this.jobBardService.professional.id!, this.activatedRoute.snapshot.params.id).subscribe(
      response => {
        response.data.startDate = new Date('2021-08-22');
        response.data.startDate.setDate(response.data.startDate.getDate() + 1);
        response.data.endDate = new Date(response.data.endDate);
        response.data.endDate.setDate(response.data.endDate.getDate() + 1);

        this.form.patchValue(response.data);
        this.skeletonLoading = false;
      }, error => {
        this.skeletonLoading = false;
        this.messageService.error(error);
      }
    ));
  }

  newForm(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      professional: [null, [Validators.required]],
      idiom: [null, [Validators.required]],
      writtenLevel: [null, [Validators.required]],
      spokenLevel: [null, [Validators.required]],
      readLevel: [null, [Validators.minLength(10)]],
    });
  }
// Foreingkeys
  getProfessionals() {
    this.userAdministrationHttpService.getCatalogues('COURSE_AREA').subscribe(
      response => {
        this.areas = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  getIdiom() {
    this.userAdministrationHttpService.getCatalogues('IDIOM').subscribe(
      response => {
        this.certificationTypes = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  getWrittenLevel() {
    this.userAdministrationHttpService.getCatalogues('COURSE_EVENT_TYPE').subscribe(
      response => {
        this.types = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  getSpokenLevel() {
    this.userAdministrationHttpService.getCatalogues('COURSE_EVENT_TYPE').subscribe(
      response => {
        this.types = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  getReadLevel() {
    this.userAdministrationHttpService.getCatalogues('COURSE_EVENT_TYPE').subscribe(
      response => {
        this.types = response.data;
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
    this.jobBardHttpService.storeCourse(language, this.jobBardService.professional.id!).subscribe(
      response => {
        this.messageService.success(response);
        this.form.reset();
        this.userNewOrUpdate.emit(language);
        this.progressBar = false;
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
    this.jobBardHttpService.updateCourse(language.id!, language, this.jobBardService.professional.id!).subscribe(
      response => {
        this.messageService.success(response);
        this.form.reset();
        this.userNewOrUpdate.emit(language);
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

  get professionalField() {
    return this.form.controls['professional'];
  }

  get idiomField() {
    return this.form.controls['idiom'];
  }

  get writtenLevelField() {
    return this.form.controls['written_Level'];
  }

  get spokenLevelField() {
    return this.form.controls['spoken_Level'];
  }

  get readLevelField() {
    return this.form.controls['read_Level'];
  }
}

