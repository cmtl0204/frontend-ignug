import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {ColModel, PaginatorModel} from '@models/core';
import {ReferenceModel} from '@models/job-board';

@Component({
  selector: 'app-reference-list',
  templateUrl: './reference-list.component.html',
  styleUrls: ['./reference-list.component.scss']
})

export class ReferenceListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  references: ReferenceModel[] = [];
  selectedReference: ReferenceModel = {};
  selectedReferences: ReferenceModel[] = [];
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
      {label: 'Referencias Profesionales', disabled: true},
    ]);

    this.filter = new FormControl('');
  }

  ngOnInit(): void {
    this.setCols();
    this.setItems();
    this.loadReferences();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadReferences() {
    this.loading = true;
    this.subscriptions.push(
      this.jobBoardHttpService.getReferences(
        this.jobBoardService.professional.id!, this.paginator, this.filter.value)
        .subscribe(
          response => {
            this.loading = false;
            this.references = response.data;
            this.paginator = response.meta;
          }, error => {
            this.loading = false;
            this.messageService.error(error);
          }
        ));
  }

  filterReferences(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadReferences();
    }
  }

  editReference(reference: ReferenceModel) {
    this.router.navigate(['/job-board/professional/reference/', reference.id]);
  }

  createReference() {
    this.router.navigate(['/job-board/professional/reference/', 'new']);
  }

  selectReference(reference: ReferenceModel) {
    this.selectedReference = reference;
  }

  deleteReference(reference: ReferenceModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          this.subscriptions.push(
            this.jobBoardHttpService.deleteReference(reference.id!, this.jobBoardService.professional?.id!)
              .subscribe(
                response => {
                  this.removeReference(reference);
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

  deleteReferences(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          const ids = this.selectedReferences.map(element => element.id);
          this.subscriptions.push(this.jobBoardHttpService.deleteReferences(ids)
            .subscribe(
              response => {
                this.removeReferences(ids!);
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

  removeReference(reference: ReferenceModel) {
    this.references = this.references.filter(element => element.id !== reference.id);
    this.paginator.total = this.paginator.total - 1;
  }

  removeReferences(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.references = this.references.filter(element => element.id !== id);
      this.paginator.total = this.paginator.total - 1;
    }
    this.selectedReferences = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadReferences();
  }

  setCols() {
    this.cols = [
      {field: 'contactName', header: 'Nombre'},
      {field: 'contactPhone', header: 'Celular'},
      {field: 'contactEmail', header: 'Correo electrónico'},
      {field: 'updatedAt', header: 'Última actualización'},
    ];
  }

  setItems() {
    this.items = [
      {
        label: 'Modificar', icon: 'pi pi-pencil', command: () => {
          this.editReference(this.selectedReference);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteReference(this.selectedReference);
        }
      }
    ];
  }
}
