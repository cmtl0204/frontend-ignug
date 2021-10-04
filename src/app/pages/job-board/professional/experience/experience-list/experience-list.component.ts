import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {MessageService} from '@services/core';
import {ExperienceModel} from '@models/job-board';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-experience-list',
  templateUrl: './experience-list.component.html',
  styleUrls: ['./experience-list.component.scss']
})
export class ExperienceListComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;

  experiences: ExperienceModel[] = [];
  selectedExperience: ExperienceModel = {};
  selectedExperiences: ExperienceModel[] = [];

  constructor(private breadcrumbService: BreadcrumbService,
              private jobBoardHttpService: JobBoardHttpService,
              private jobBoardService: JobBoardService,
              public messageService: MessageService,
              private router: Router) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Experiencia', disabled: true},
    ]);

    this.filter = new FormControl('');
  }

  ngOnInit(): void {
    this.setCols();
    this.setItems();
    this.loadExperiences();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadExperiences() {
    this.loading = true;
    this.subscriptions.push(
      this.jobBoardHttpService.getExperiences(this.jobBoardService.professional.id!, this.paginator, this.filter.value).subscribe(
        response => {
          this.loading = false;
          this.experiences = response.data;
          this.paginator = response.meta;
        }, error => {
          this.loading = false;
          this.messageService.error(error);
        }
      ));
  }

  filterExperiences(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadExperiences();
    }
  }

  editExperience(user: ExperienceModel) {
    this.router.navigate(['/job-board/professional/experience/', user.id]);
  }

  createExperience() {
    this.router.navigate(['/job-board/professional/experience/', 'new']);
  }

  selectExperience(experience: ExperienceModel) {
    this.selectedExperience = experience;
  }

  deleteExperience(experience: ExperienceModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.subscriptions.push(this.jobBoardHttpService.deleteCourse(this.jobBoardService.professional?.id!, experience.id!).subscribe(
            response => {
              this.removeExperience(experience);
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          ));
        }
      });
  }

  deleteExperiences(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          const ids = this.selectedExperiences.map(element => element.id);
          this.subscriptions.push(this.jobBoardHttpService.deleteExperiences(ids).subscribe(
            response => {
              this.removeExperiences(ids!);
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          ));
        }
      });

  }

  removeExperience(experience: ExperienceModel) {
    this.experiences = this.experiences.filter(element => element.id !== experience.id);
  }

  removeExperiences(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.experiences = this.experiences.filter(element => element.id !== id);
    }
    this.selectedExperiences = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadExperiences();
  }

  setCols() {
    this.cols = [
      {field: 'name', header: 'Evento'},
      {field: 'institution', header: 'Institución'},
      {field: 'hours', header: 'Horas'},
      {field: 'startDate', header: 'Inicio'},
      {field: 'endDate', header: 'Fin'},
    ];

  }

  setItems() {
    this.items = [
      {
        label: 'Modificar', icon: 'pi pi-pencil', command: () => {
          this.editExperience(this.selectedExperience);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteExperience(this.selectedExperience);
        }
      }
    ];
  }
}

