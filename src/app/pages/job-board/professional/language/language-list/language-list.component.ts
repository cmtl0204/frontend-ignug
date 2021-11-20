import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {ColModel, PaginatorModel} from '@models/core';
import {LanguageModel} from '@models/job-board';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.scss']
})

export class LanguageListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  languages: LanguageModel[] = [];
  selectedLanguage: LanguageModel = {};
  selectedLanguages: LanguageModel[] = [];
  progressBarDelete: boolean = false;

  constructor(private router: Router,
              private breadcrumbService: BreadcrumbService,
              public messageService: MessageService,
              private jobBoardHttpService: JobBoardHttpService,
              private jobBoardService: JobBoardService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Idiomas', disabled: true},
    ]);

    this.filter = new FormControl(null);
  }

  ngOnInit(): void {
    this.setCols();
    this.setItems();
    this.loadLanguages();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadLanguages() {
    this.loading = true;
    this.subscriptions.push(
      this.jobBoardHttpService.getLanguages(this.jobBoardService.professional.id!, this.paginator, this.filter.value)
        .subscribe(
          response => {
            this.loading = false;
            this.languages = response.data;
            this.paginator = response.meta;
          }, error => {
            this.loading = false;
            this.messageService.error(error);
          }
        ));
  }

  filterLanguages(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadLanguages();
    }
  }

  editLanguage(language: LanguageModel) {
    this.router.navigate(['/job-board/professional/language/', language.id]);
  }

  createLanguage() {
    this.router.navigate(['/job-board/professional/language/', 'new']);
  }

  selectLanguage(language: LanguageModel) {
    this.selectedLanguage = language;
  }

  deleteLanguage(language: LanguageModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          this.subscriptions.push(
            this.jobBoardHttpService.deleteLanguage(language.id!, this.jobBoardService.professional?.id!)
              .subscribe(
                response => {
                  this.removeLanguage(language);
                  this.messageService.success(response);
                  this.progressBarDelete = false;
                },
                error => {
                  this.messageService.error(error);
                  this.progressBarDelete = false;
                }
              ));
        }
      });
  }

  deleteLanguages(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          const ids = this.selectedLanguages.map(element => element.id);
          this.subscriptions.push(
            this.jobBoardHttpService.deleteLanguages(ids)
              .subscribe(
                response => {
                  this.removeLanguages(ids!);
                  this.messageService.success(response);
                  this.progressBarDelete = false;
                },
                error => {
                  this.messageService.error(error);
                  this.progressBarDelete = false;
                }
              ));
        }
      });
  }

  removeLanguage(language: LanguageModel) {
    this.languages = this.languages.filter(element => element.id !== language.id);
    this.paginator.total = this.paginator.total - 1;
  }

  removeLanguages(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.languages = this.languages.filter(element => element.id !== id);
      this.paginator.total = this.paginator.total - 1;
    }
    this.selectedLanguages = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadLanguages();
  }

  setCols() {
    this.cols = [
      {field: 'idiom', header: 'Idioma'},
      {field: 'writtenLevel', header: 'Nivel escrito'},
      {field: 'spokenLevel', header: 'Nivel hablado'},
      {field: 'readLevel', header: 'Nivel lectura'},
      {field: 'updatedAt', header: 'Última actualización'},
    ];
  }

  setItems() {
    this.items = [
      {
        label: 'Modificar', icon: 'pi pi-pencil', command: () => {
          this.editLanguage(this.selectedLanguage);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteLanguage(this.selectedLanguage);
        }
      }
    ];
  }
}
