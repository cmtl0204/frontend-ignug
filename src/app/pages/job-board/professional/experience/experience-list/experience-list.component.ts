import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {ColModel, PaginatorModel} from '@models/core';
import {ExperienceModel} from '@models/job-board';


@Component({
  selector: 'app-experience-list',
  templateUrl: './experience-list.component.html',
  styleUrls: ['./experience-list.component.scss']
})

export class ExperienceListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  experiences: ExperienceModel[] = [];
  selectedExperience: ExperienceModel = {};
  selectedExperiences: ExperienceModel[] = [];
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
      {label: 'Experiencias Profesionales', disabled: true},
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
      this.jobBoardHttpService.getExperiences(this.jobBoardService.professional.id!, this.paginator, this.filter.value)
        .subscribe(
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

  editExperience(experience: ExperienceModel) {
    this.router.navigate(['/job-board/professional/experience/', experience.id]);
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
          this.progressBarDelete = true;
          this.subscriptions.push(
            this.jobBoardHttpService.deleteExperience(experience.id!, this.jobBoardService.professional?.id!)
              .subscribe(
                response => {
                  this.removeExperience(experience);
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

  deleteExperiences(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          const ids = this.selectedExperiences.map(element => element.id);
          this.subscriptions.push(
            this.jobBoardHttpService.deleteExperiences(ids)
              .subscribe(
                response => {
                  this.removeExperiences(ids!);
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

  removeExperience(experience: ExperienceModel) {
    this.experiences = this.experiences.filter(element => element.id !== experience.id);
    this.paginator.total = this.paginator.total - 1;
  }

  removeExperiences(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.experiences = this.experiences.filter(element => element.id !== id);
      this.paginator.total = this.paginator.total - 1;
    }
    this.selectedExperiences = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadExperiences();
  }

  setCols() {
    this.cols = [
      {field: 'position', header: 'Cargo'},
      {field: 'startedAt', header: 'Fecha de inicio'},
      {field: 'endedAt', header: 'Fecha de fin'},
      {field: 'worked', header: '¿Trabaja actualmente?'},
      {field: 'updatedAt', header: 'Última actualización'},
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

