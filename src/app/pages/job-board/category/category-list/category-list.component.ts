import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {JobBoardHttpService} from '@services/job-board';
import {MessageService} from '@services/core';
import {CategoryModel} from '@models/job-board';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  categories: CategoryModel[] = [];
  selectedCategory: CategoryModel = {};
  selectedCategories: CategoryModel[] = [];
  progressBarDelete: boolean = false;

  constructor(private router: Router,
              private breadcrumbService: BreadcrumbService,
              public messageService: MessageService,
              private jobBoardHttpService: JobBoardHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Títulos Profesionales', disabled: true},
    ]);

    this.filter = new FormControl('');
  }

  ngOnInit(): void {
    this.setCols();
    this.setItems();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadCategories() {
    this.loading = true;
    this.subscriptions.push(
      this.jobBoardHttpService.getCategories(this.paginator, this.filter.value).subscribe(
        response => {
          this.loading = false;
          this.categories = response.data;
          this.paginator = response.meta;
        }, error => {
          this.loading = false;
          this.messageService.error(error);
        }
      ));
  }

  filterCategories(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadCategories();
    }
  }

  editCategory(category: CategoryModel) {
    this.router.navigate(['/job-board/category/professional-degree/', category.id]);
  }

  editArea(category: CategoryModel) {
    this.router.navigate(['/job-board/category/area/', category.id]);
  }

  createArea() {
    this.router.navigate(['/job-board/category/area/', 'new']);
  }

  createProfessionalDegree() {
    this.router.navigate(['/job-board/category/professional-degree/', 'new']);
  }

  selectCategory(category: CategoryModel) {
    this.selectedCategory = category;
    console.log('estoy en selectCategory', this.selectedCategory);
    this.setItems();
  }

  deleteCategory(category: CategoryModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          this.subscriptions.push(this.jobBoardHttpService.deleteCategory(category.id!).subscribe(
            response => {
              this.removeCategory(category);
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

  deleteCategories(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          const ids = this.selectedCategories.map(element => element.id);
          this.subscriptions.push(this.jobBoardHttpService.deleteCategories(ids).subscribe(
            response => {
              this.removeCategories(ids!);
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

  removeCategory(category: CategoryModel) {
    this.categories = this.categories.filter(element => element.id !== category.id);
    this.paginator.total = this.paginator.total - 1;
  }

  removeCategories(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.categories = this.categories.filter(element => element.id !== id);
      this.paginator.total = this.paginator.total - 1;
    }
    this.selectedCategories = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadCategories();
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
        command: this.selectedCategory.parent
          ? () => {
            this.editCategory(this.selectedCategory);
          }
          : () => {
            this.editArea(this.selectedCategory);
          }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteCategory(this.selectedCategory);
        }
      }
    ];
  }

}
