import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {UicHttpService, UicService} from '@services/uic';
import {MessageService} from '@services/core';
import {RequirementModel,} from '@models/uic';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-requirement-list',
  templateUrl: './requirement-list.component.html',
  styleUrls: ['./requirement-list.component.scss']
})

export class RequirementListComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  progressBarDelete: boolean = false;
  requirements: RequirementModel[] = [];
  selectedRequirement: RequirementModel = {};
  selectedRequirements: RequirementModel[] = [];

  constructor(private router: Router,
              private breadcrumbService: BreadcrumbService,
              public messageService: MessageService,
              private uicHttpService: UicHttpService,
              private uicService: UicService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Requerimiento', disabled: true},
    ]);

    this.filter = new FormControl('');
  }

  ngOnInit(): void {
    this.setCols();
    this.setItems();
    this.loadRequirements();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadRequirements() {
    this.loading = true;
    this.subscriptions.push(
      this.uicHttpService.getRequirements(this.paginator, this.filter.value).subscribe(
        response => {
          this.loading = false;
          this.requirements = response.data;
          this.paginator = response.meta;
        }, error => {
          this.loading = false;
          this.messageService.error(error);
        }
      ));
  }

  filterRequirements(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadRequirements();
    }
  }

  editRequirement(requirement: RequirementModel) {
    this.router.navigate(['/uic/professional/requirement/', requirement.id]);
  }

  createRequirement() {
    this.router.navigate(['/uic/professional/requirement/', 'new']);
  }

  selectRequirement(requirement: RequirementModel) {
    this.selectedRequirement = requirement;
  }

  deleteRequirement(requirement:RequirementModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          this.subscriptions.push(this.uicHttpService.deleteRequirement(requirement.id!).subscribe(
            response => {
              this.removeRequirement(requirement);
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

  deleteRequirements(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          const ids = this.selectedRequirements.map(element => element.id);
          this.subscriptions.push(this.uicHttpService.deleteRequirements(ids).subscribe(
            response => {
              this.removeRequirements(ids!);
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

  removeRequirement(requirement: RequirementModel) {
    this.requirements = this.requirements.filter(element => element.id !== requirement.id);
    this.paginator.total = this.paginator.total - 1;
  }

  removeRequirements(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.requirements = this.requirements.filter(element => element.id !== id);
      this.paginator.total = this.paginator.total - 1;
    }
    this.selectedRequirements = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadRequirements();
  }

  setCols() {
    this.cols = [
      {field: 'career', header: 'Carrera'},
      {field: 'name', header: 'Nombre'},
      {field: 'required', header: '¿Es requerido?'},
      {field: 'solicited', header: '¿Se solicita?'},
    ];
  }

  setItems() {
    this.items = [
      {
        label: 'Modificar', icon: 'pi pi-pencil', command: () => {
          this.editRequirement(this.selectedRequirement);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteRequirement(this.selectedRequirement);
        }
      }
    ];
  }
}
