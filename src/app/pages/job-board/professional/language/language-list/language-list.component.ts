import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {MessageService} from '@services/core';
import {CourseModel} from '@models/job-board';
import {ColModel, PaginatorModel} from '@models/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.scss']
})
export class LanguageListComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  courses: CourseModel[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  selectedCourse: CourseModel = {};
  selectedCourses: CourseModel[] = [];
  filter: FormControl;

  constructor(private breadcrumbService: BreadcrumbService,
              private jobBoardHttpService: JobBoardHttpService,
              private jobBoardService: JobBoardService,
              public messageService: MessageService,
              private router: Router) {
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
    this.getCourses();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getCourses() {
    this.loading = true;
    this.subscriptions.push(
      this.jobBoardHttpService.getCourses(this.jobBoardService.professional.id!, this.paginator, this.filter.value).subscribe(
        response => {
          this.loading = false;
          this.courses = response.data;
          this.paginator = response.meta;
        }, error => {
          this.loading = false;
          this.messageService.error(error);
        }
      ));
  }

  filterCourses(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.getCourses();
    }
  }

  editCourse(user: CourseModel) {
    this.router.navigate(['/job-board/professional/course/', user.id]);
  }

  createCourse() {
    this.router.navigate(['/job-board/professional/course/', 'new']);
  }

  selectCourse(course: CourseModel) {
    this.selectedCourse = course;
  }

  deleteCourse(course: CourseModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.subscriptions.push(this.jobBoardHttpService.deleteCourse(this.jobBoardService.professional?.id!, course.id!).subscribe(
            response => {
              this.removeCourse(course);
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          ));
        }
      });
  }

  deleteCourses(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          const ids = this.selectedCourses.map(element => element.id);
          this.subscriptions.push(this.jobBoardHttpService.deleteCourses(ids).subscribe(
            response => {
              this.removeCourses(ids!);
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          ));
        }
      });

  }

  removeCourse(course: CourseModel) {
    this.courses = this.courses.filter(element => element.id !== course.id);
  }

  removeCourses(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.courses = this.courses.filter(element => element.id !== id);
    }
    this.selectedCourses = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.getCourses();
  }

  setCols() {
    this.cols = [
      {field: 'name', header: 'Evento'},
      {field: 'institution', header: 'Institución'},
      {field: 'hours', header: 'Horas'},
      {field: 'startDate', header: 'Inicio'},
      {field: 'endDate', header: 'Fin'},
    ];

  }

  setItems() {
    this.items = [
      {
        label: 'Modificar', icon: 'pi pi-pencil', command: () => {
          this.editCourse(this.selectedCourse);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteCourse(this.selectedCourse);
        }
      }
    ];
  }
}

