import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {MessageService} from '@services/core';
import {CategoryModel} from '@models/job-board';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  
  categories: CategoryModel[] = [];
  selectedCategory: CategoryModel = {};
  selectedCategories: CategoryModel[] = [];

  constructor(private router: Router,
              private breadcrumbService: BreadcrumbService,
              public messageService: MessageService,
              private jobBoardHttpService: JobBoardHttpService,
              ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Cursos y Capacitaciones', disabled: true},
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
    this.router.navigate(['/job-board/professional/category/', category.id]);
  }

  createCategory() {
    this.router.navigate(['/job-board/professional/category/', 'new']);
  }

  selectCategory(category: CategoryModel) {
    this.selectedCategory = category;
  }

  deleteCategory(category: CategoryModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.subscriptions.push(this.jobBoardHttpService.deleteCategory(category.id!).subscribe(
            response => {
              this.removeCategory(category);
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          ));
        }
      });
  }

  deleteCategories(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          const ids = this.selectedCategories.map(element => element.id);
          this.subscriptions.push(this.jobBoardHttpService.deleteCategories(ids).subscribe(
            response => {
              this.removeCategories(ids!);
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          ));
        }
      });

  }

  removeCategory(category: CategoryModel) {
    this.categories = this.categories.filter(element => element.id !== category.id);
  }

  removeCategories(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.categories = this.categories.filter(element => element.id !== id);
    }
    this.selectedCategories = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadCategories();
  }

  setCols() {
    this.cols = [
      {field: 'name', header: 'Nombre'},
      {field: 'parent', header: 'Área'},
      {field: 'code', header: 'Código'},
      {field: 'icon', header: 'Ícono'},
      {field: 'children', header: 'Títulos profesionales'},
    ];

  }

  setItems() {
    this.items = [
      {
        label: 'Modificar', icon: 'pi pi-pencil', command: () => {
          this.editCategory(this.selectedCategory);
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
