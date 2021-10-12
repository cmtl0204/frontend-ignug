import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {MessageService} from '@services/core';
import {CourseModel} from '@models/job-board';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})

export class CourseListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  courses: CourseModel[] = [];
  selectedCourse: CourseModel = {};
  selectedCourses: CourseModel[] = [];

  constructor(private router: Router,
              private breadcrumbService: BreadcrumbService,
              public messageService: MessageService,
              private jobBoardHttpService: JobBoardHttpService,
              private jobBoardService: JobBoardService,
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
    this.loadCourses();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadCourses() {
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
      this.loadCourses();
    }
  }

  editCourse(course: CourseModel) {
    this.router.navigate(['/job-board/professional/course/', course.id]);
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
          this.subscriptions.push(this.jobBoardHttpService.deleteCourse(course.id!, this.jobBoardService.professional?.id!).subscribe(
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
    this.loadCourses();
  }

  setCols() {
    this.cols = [
      {field: 'name', header: 'Evento'},
      {field: 'institution', header: 'Tipo de Evento'},
      {field: 'hours', header: 'Horas'},
      {field: 'startedAt', header: 'Inicio'},
      {field: 'endedAt', header: 'Fin'},
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
