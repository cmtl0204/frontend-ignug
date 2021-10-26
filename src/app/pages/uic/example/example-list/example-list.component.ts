import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {CustomHttpService} from '@services/custom';
import {MessageService} from '@services/core';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl} from '@angular/forms';
import {ExampleModel} from '@models/custom';

@Component({
  selector: 'app-category-list',
  templateUrl: './example-list.component.html',
  styleUrls: ['./example-list.component.scss']
})
export class ExampleListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  progressBarDelete: boolean = false;
  examples: ExampleModel[] = [];
  selectedExample: ExampleModel = {};
  selectedExamples: ExampleModel[] = [];

  constructor(private router: Router,
              private breadcrumbService: BreadcrumbService,
              public messageService: MessageService,
              private customHttpService: CustomHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Title Custom', disabled: true},
    ]);

    this.filter = new FormControl(null);
  }

  ngOnInit(): void {
    this.setCols();
    this.setItems();
    this.loadExamples();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadExamples() {
    this.loading = true;
    this.subscriptions.push(
      this.customHttpService.getCustoms(this.paginator, this.filter.value).subscribe(
        response => {
          this.loading = false;
          this.examples = response.data;
          this.paginator = response.meta;
        }, error => {
          this.loading = false;
          this.messageService.error(error);
        }
      ));
  }

  filterExamples(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadExamples();
    }
  }

  editExample(example: ExampleModel) {
    this.router.navigate(['/custom/example/', example.id]);
  }


  createExample() {
    this.router.navigate(['/custom/example/', 'new']);
  }

  selectExample(example: ExampleModel) {
    this.selectedExample = example;
    this.setItems();
  }

  deleteExample(example: ExampleModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          this.subscriptions.push(this.customHttpService.deleteCustom(example.id!)
            .subscribe(
              response => {
                this.removeExample(example);
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

  deleteExamples(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          const ids = this.selectedExamples.map(element => element.id);
          this.subscriptions.push(this.customHttpService.deleteCustoms(ids).subscribe(
            response => {
              this.removeExamples(ids!);
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

  removeExample(example: ExampleModel) {
    this.examples = this.examples.filter(element => element.id !== example.id);
    this.paginator.total = this.paginator.total - 1;
  }

  removeExamples(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.examples = this.examples.filter(element => element.id !== id);
      this.paginator.total = this.paginator.total - 1;
    }
    this.selectedExamples = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadExamples();
  }

  setCols() {
    this.cols = [
      {field: 'parent', header: 'Área'},
      {field: 'name', header: 'Título'},
      {field: 'updatedAt', header: 'Última actualización'},
    ];

  }

  setItems() {
    this.items = [
      {
        label: 'Modificar',
        icon: 'pi pi-pencil',
        command: () => {
          this.editExample(this.selectedExample);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteExample(this.selectedExample);
        }
      }
    ];
  }

}
