import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {MessageService} from '@services/core';
import {LanguageModel} from '@models/job-board';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.scss']
})
export class LanguageListComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;

  languages: LanguageModel[] = [];
  selectedLanguage: LanguageModel = {};
  selectedLanguages: LanguageModel[] = [];

  constructor(private breadcrumbService: BreadcrumbService,
              private jobBoardHttpService: JobBoardHttpService,
              private jobBoardService: JobBoardService,
              public messageService: MessageService,
              private router: Router) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Idioma', disabled: true},
    ]);

    this.filter = new FormControl('');
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
      this.jobBoardHttpService.getLanguages(this.jobBoardService.professional.id!, this.paginator, this.filter.value).subscribe(
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

  editLanguage(user: LanguageModel) {
    this.router.navigate(['/job-board/professional/language/', user.id]);
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
          this.subscriptions.push(this.jobBoardHttpService.deleteLanguage(this.jobBoardService.professional?.id!, language.id!).subscribe(
            response => {
              this.removeLanguage(language);
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          ));
        }
      });
  }

  deleteLanguages(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          const ids = this.selectedLanguages.map(element => element.id);
          this.subscriptions.push(this.jobBoardHttpService.deleteLanguages(ids).subscribe(
            response => {
              this.removeLanguages(ids!);
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          ));
        }
      });

  }

  removeLanguage(language: LanguageModel) {
    this.languages = this.languages.filter(element => element.id !== language.id);
  }

  removeLanguages(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.languages = this.languages.filter(element => element.id !== id);
    }
    this.selectedLanguages = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadLanguages();
  }

  setCols() {
    this.cols = [
      {field: 'id', header: 'id'},
      {field: 'idiom', header: 'Idioma'},
      {field: 'writtenLevel', header: 'Horas'},
      {field: 'spokenLevel', header: 'Inicio'},
      {field: 'readLevel', header: 'Fin'},
      {field: 'createdAt', header: 'Fin'},
      {field: 'updatedAt', header: 'Fin'},
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

