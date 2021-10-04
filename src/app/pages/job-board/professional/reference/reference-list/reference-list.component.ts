import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {CoreHttpService, MessageService} from '@services/core';
import {ReferenceModel} from '@models/job-board';
import {ColModel, PaginatorModel} from '@models/core';

@Component({
  selector: 'app-reference-list',
  templateUrl: './reference-list.component.html',
  styleUrls: ['./reference-list.component.scss']
})
export class ReferenceComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;

  references: ReferenceModel[] = [];
  selectedReference: ReferenceModel = {};
  selectedReferences: ReferenceModel[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private coreHttpService: CoreHttpService,
    private jobBoardHttpService: JobBoardHttpService,
    private jobBoardService: JobBoardService
    ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Referencias', disabled: true},
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
      this.jobBoardHttpService.getReferences(this.jobBoardService.professional.id!, this.paginator, this.filter.value).subscribe(
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
          this.subscriptions.push(this.jobBoardHttpService.deleteReference(this.jobBoardService.professional?.id!, reference.id!).subscribe(
            response => {
              this.removeReference(reference);
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          ));
        }
      });
  }

  deleteReferences(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          const ids = this.selectedReferences.map(element => element.id);
          this.subscriptions.push(this.jobBoardHttpService.deleteReferences(ids).subscribe(
            response => {
              this.removeReferences(ids!);
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          ));
        }
      });

  }

  removeReference(reference: ReferenceModel) {
    this.references = this.references.filter(element => element.id !== reference.id);
  }

  removeReferences(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.references = this.references.filter(element => element.id !== id);
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
      {field: 'contactEmail', header: 'E-mail'},
      {field: 'institution', header: 'Institución'},
      {field: 'createdAt', header: 'Crear fecha'},
      {field: 'updatedAt', header: 'Aztualizar fecha'},
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
