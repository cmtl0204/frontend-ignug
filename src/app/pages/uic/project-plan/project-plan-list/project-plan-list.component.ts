import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {UicHttpService, UicService} from '@services/uic';
import {MessageService} from '@services/core';
import {ProjectPlanModel,} from '@models/uic';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-project-plan-list',
  templateUrl: './project-plan-list.component.html',
  styleUrls: ['./project-plan-list.component.scss']
})

export class ProjectListComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  progressBarDelete: boolean = false;
  projectPlans: ProjectPlanModel[] = [];
  selectedProjectPlan: ProjectPlanModel = {};
  selectedProjectPlans: ProjectPlanModel[] = [];

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
    this.loadProjectPlans();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadProjectPlans() {
    this.loading = true;
    this.subscriptions.push(
      this.uicHttpService.getProjectPlans( this.paginator, this.filter.value).subscribe(
        response => {
          this.loading = false;
          this.projectPlans = response.data;
          this.paginator = response.meta;
        }, error => {
          this.loading = false;
          this.messageService.error(error);
        }
      ));
  }

  filterProjectPlans(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadProjectPlans();
    }
  }

  editProjectPlan(projectPlan: ProjectPlanModel) {
    this.router.navigate(['/uic/professional/projectPlan/', projectPlan.id]);
  }

  createProjectPlan() {
    this.router.navigate(['/uic/professional/projectPlan/', 'new']);
  }

  selectProjectPlan(projectPlan: ProjectPlanModel) {
    this.selectedProjectPlan = projectPlan;
  }

  deleteProjectPlan(projectPlan: ProjectPlanModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          this.subscriptions.push(this.uicHttpService.deleteProjectPlan(projectPlan.id!).subscribe(
            response => {
              this.removeProjectPlan(projectPlan);
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

  deleteProjectPlans(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          const ids = this.selectedProjectPlans.map(element => element.id);
          this.subscriptions.push(this.uicHttpService.deleteProjectPlans(ids).subscribe(
            response => {
              this.removeProjectPlans(ids!);
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

  removeProjectPlan(projectPlan: ProjectPlanModel) {
    this.projectPlans = this.projectPlans.filter(element => element.id !== projectPlan.id);
    this.paginator.total = this.paginator.total - 1;
  }

  removeProjectPlans(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.projectPlans = this.projectPlans.filter(element => element.id !== id);
      this.paginator.total = this.paginator.total - 1;
    }
    this.selectedProjectPlans = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadProjectPlans();
  }

  setCols() {
    this.cols = [
      {field: 'title', header: 'Titulo'},
      {field: 'description', header: 'Descripcion'},
      {field: 'actCode', header: 'Codigo de acta'},
      {field: 'approvedAt', header: 'Fecha de aprovacion'},
      {field: 'approved', header: 'Aprovado'},
      {field: 'observations', header: 'Observaciones'},
    ];
  }

  setItems() {
    this.items = [
      {
        label: 'Modificar', icon: 'pi pi-pencil', command: () => {
          this.editProjectPlan(this.selectedProjectPlan);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteProjectPlan(this.selectedProjectPlan);
        }
      }
    ];
  }
}
