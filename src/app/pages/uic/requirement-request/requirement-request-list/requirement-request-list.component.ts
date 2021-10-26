import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {UicHttpService, UicService} from '@services/job-board';
import {MessageService} from '@services/core';
import {RequirementRequestModel,} from '@models/job-board';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-academic-formation-list',
  templateUrl: './academic-formation-list.component.html',
  styleUrls: ['./academic-formation-list.component.scss']
})

export class RequirementRequetListComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  progressBarDelete: boolean = false;
  requirementRequests: RequirementRequestModel[] = [];
  selectedRequirementRequest: RequirementRequestModel = {};
  selectedRequirementRequests: RequirementRequestModel[] = [];

  constructor(private router: Router,
              private breadcrumbService: BreadcrumbService,
              public messageService: MessageService,
              private uicHttpService: UicHttpService,
              private uicService: UicService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Formación académica', disabled: true},
    ]);

    this.filter = new FormControl('');
  }

  ngOnInit(): void {
    this.setCols();
    this.setItems();
    this.loadRequirementRequests();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadRequirementRequests() {
    this.loading = true;
    this.subscriptions.push(
      this.uicHttpService.getRequirementRequets(this.paginator, this.filter.value).subscribe(
        response => {
          this.loading = false;
          this.requirementRequests = response.data;
          this.paginator = response.meta;
        }, error => {
          this.loading = false;
          this.messageService.error(error);
        }
      ));
  }

  filterRequirementRequets(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadRequirementRequests();
    }
  }

  editRequirementRequet(requirementRequet: RequirementRequestModel) {
    this.router.navigate(['/job-board/professional/academic-formation/', requirementRequet.id]);
  }

  createRequirementRequet() {
    this.router.navigate(['/job-board/professional/academic-formation/', 'new']);
  }

  selectRequirementRequet(requirementRequet: RequirementRequestModel) {
    this.selectedRequirementRequest = requirementRequet;
  }

  deleteRequirementRequet(requirementRequet: RequirementRequestModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          this.subscriptions.push(this.uicHttpService.deleteRequirementRequet(requirementRequet.id!, this.uicService.professional?.id!).subscribe(
            response => {
              this.removeRequirementRequet(requirementRequet);
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

  deleteRequirementRequets(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          const ids = this.selectedRequirementRequests.map(element => element.id);
          this.subscriptions.push(this.uicHttpService.deleteRequirementRequets(ids).subscribe(
            response => {
              this.removeRequirementRequets(ids!);
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

  removeRequirementRequet(requirementRequet: RequirementRequestModel) {
    this.requirementRequests = this.requirementRequests.filter(element => element.id !== requirementRequet.id);
    this.paginator.total = this.paginator.total - 1;
  }

  removeRequirementRequets(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.requirementRequests = this.requirementRequests.filter(element => element.id !== id);
      this.paginator.total = this.paginator.total - 1;
    }
    this.selectedRequirementRequests = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadRequirementRequests();
  }

  setCols() {
    this.cols = [
      {field: 'requirement', header: 'Requerimiento'},
      {field: 'meshStudent', header: 'Fecha de registro'},
      {field: 'registeredAt', header: 'Fecha de registro'},
      {field: 'approved', header: '¿Aprobó?'},
      {field: 'observations', header: 'Observaciones'},
      {field: 'updateAt', header: 'Última actualización'},
    ];
  }

  setItems() {
    this.items = [
      {
        label: 'Modificar', icon: 'pi pi-pencil', command: () => {
          this.editRequirementRequet(this.selectedRequirementRequest);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteRequirementRequet(this.selectedRequirementRequest);
        }
      }
    ];
  }
}
