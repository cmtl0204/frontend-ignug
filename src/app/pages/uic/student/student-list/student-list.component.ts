import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {UicHttpService, UicService} from '@services/uic';
import {MessageService} from '@services/core';
import {StudentModel,} from '@models/uic';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})

export class StudentListComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  progressBarDelete: boolean = false;
  student: StudentModel[] = [];
  selectedStudent: StudentModel = {};
  selectedStudents: StudentModel[] = [];

  constructor(private router: Router,
              private breadcrumbService: BreadcrumbService,
              public messageService: MessageService,
              private uicHttpService: UicHttpService,
              private uicService: UicService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/uic/professional']},
      {label: 'Estudiante', disabled: true},
    ]);

    this.filter = new FormControl('');
  }

  ngOnInit(): void {
    this.setCols();
    this.setItems();
    this.loadStudents();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadStudents() {
    this.loading = true;
    this.subscriptions.push(
      this.uicHttpService.getStudents(this.uicService.professional.id!, this.paginator, this.filter.value).subscribe(
        response => {
          this.loading = false;
          this.students = response.data;
          this.paginator = response.meta;
        }, error => {
          this.loading = false;
          this.messageService.error(error);
        }
      ));
  }

  filterStudents(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadStudents();
    }
  }

  editStudent(student: StudentModel) {
    this.router.navigate(['/uic/professional/student/', student.id]);
  }

  createStudent() {
    this.router.navigate(['/uic/professional/student/', 'new']);
  }

  selectStudent(student: StudentModel) {
    this.selectedStudent = student;
  }

  deleteStudent(student: StudentModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          this.subscriptions.push(this.uicHttpService.deleteStudent(student.id!, this.uicService.professional?.id!).subscribe(
            response => {
              this.removeStudent(student);
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

  deleteStudents(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          const ids = this.selectedStudents.map(element => element.id);
          this.subscriptions.push(this.uicHttpService.deleteStudents(ids).subscribe(
            response => {
              this.removeStudents(ids!);
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

  removeStudent(student: StudentModel) {
    this.students = this.students.filter(element => element.id !== student.id);
    this.paginator.total = this.paginator.total - 1;
  }

  removeStudents(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.students = this.students.filter(element => element.id !== id);
      this.paginator.total = this.paginator.total - 1;
    }
    this.selectedStudents = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadStudents();
  }

  setCols() {
    this.cols = [
      {field: 'projectPlan', header: 'Plan de proyecto'},
      {field: 'observations', header: 'Observaciones'},
      {field: 'updatedAt', header: 'Última actualización'},
    ];
  }

  setItems() {
    this.items = [
      {
        label: 'Modificar', icon: 'pi pi-pencil', command: () => {
          this.editStudent(this.selectedStudent);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteStudent(this.selectedStudent);
        }
      }
    ];
  }
}
