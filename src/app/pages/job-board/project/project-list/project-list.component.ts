import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {UicHttpService, UicService} from '@services/uic';
import {MessageService} from '@services/core';
import {ProjectModel,} from '@models/uic';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})

export class AcademicFormationListComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  progressBarDelete: boolean = false;
  project: ProjectModel[] = [];
  selectedProject: ProjectModel = {};
  selectedProjects: ProjectModel[] = [];

  constructor(private router: Router,
              private breadcrumbService: BreadcrumbService,
              public messageService: MessageService,
              private uicHttpService: UicHttpService,
              private uicService: UicService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/uic/professional']},
      {label: 'Proyecto', disabled: true},
    ]);

    this.filter = new FormControl('');
  }

  ngOnInit(): void {
    this.setCols();
    this.setItems();
    this.loadProjects();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadProjects() {
    this.loading = true;
    this.subscriptions.push(
      this.uicHttpService.getProjects( this.paginator, this.filter.value).subscribe(
        response => {
          this.loading = false;
          this.projects = response.data;
          this.paginator = response.meta;
        }, error => {
          this.loading = false;
          this.messageService.error(error);
        }
      ));
  }

  filterProjects(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadProjects();
    }
  }

  editProject(project: ProjectModel) {
    this.router.navigate(['/uic/professional/project/', project.id]);
  }

  createProject() {
    this.router.navigate(['/uic/professional/project/', 'new']);
  }

  selectProject(project: ProjectModel) {
    this.selectedProject = project;
  }

  deleteProject(project: ProjectModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          this.subscriptions.push(this.uicHttpService.deleteProject(project.id!, this.uicService.professional?.id!).subscribe(
            response => {
              this.removeProject(project);
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

  deleteProjects(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          const ids = this.selectedProjects.map(element => element.id);
          this.subscriptions.push(this.uicHttpService.deleteProjects(ids).subscribe(
            response => {
              this.removeProjects(ids!);
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

  removeProject(project: ProjectModel) {
    this.projects = this.projects.filter(element => element.id !== project.id);
    this.paginator.total = this.paginator.total - 1;
  }

  removeProjects(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.projects = this.projects.filter(element => element.id !== id);
      this.paginator.total = this.paginator.total - 1;
    }
    this.selectedProjects = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadProjects();
  }

  setCols() {
    this.cols = [
      {field: 'enrollment', header: 'Inscripcion'},
      {field: 'projectPlan', header: 'Plan de proyecto'},
      {field: 'title', header: 'Titulo'},
      {field: 'description', header: 'Descripcion'},
      {field: 'score', header: 'Puntaje'},
      {field: 'totalAdvance', header: 'Avance total'},
      {field: 'approved', header: 'Aprovado'},
      {field: 'tutorAsigned', header: 'Tutor asignado'},
      {field: 'observations', header: 'Observaciones'},
    ];
  }

  setItems() {
    this.items = [
      {
        label: 'Modificar', icon: 'pi pi-pencil', command: () => {
          this.editProject(this.selectedProject);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteProject(this.selectedProject);
        }
      }
    ];
  }
}
