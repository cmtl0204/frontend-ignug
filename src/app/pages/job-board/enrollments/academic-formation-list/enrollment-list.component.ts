import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {MessageService} from '@services/core';
import {AcademicFormationModel,} from '@models/job-board';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-enrollment-list',
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.scss']
})

export class EnrollmentListComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  academicFormations: EnrollmentModel[] = [];
  selectedAcademicFormation: EnrollmentModel = {};
  selectedAcademicFormations: EnrollmentModel[] = [];
  progressBarDelete: boolean = false;

  constructor(private router: Router,
              private breadcrumbService: BreadcrumbService,
              public messageService: MessageService,
              private uicHttpService: uicHttpService,
              private uicService: uicService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Inscripción', disabled: true},
    ]);

    this.filter = new FormControl('');
  }

  ngOnInit(): void {
    this.setCols();
    this.setItems();
    this.loadEnrollments();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadEnrollments() {
    this.loading = true;
    this.subscriptions.push(
      this.uicHttpService.getEnrollments(this.paginator, this.filter.value).subscribe(
        response => {
          this.loading = false;
          this.enrollments = response.data;
          this.paginator = response.meta;
        }, error => {
          this.loading = false;
          this.messageService.error(error);
        }
      ));
  }

  filterEnrollments(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadEnrollments();
    }
  }

  editEnrollment(user: EnrollmentModel) {
    this.router.navigate(['/job-board/professional/enrollment/', user.id]);
  }

  createEnrollment() {
    this.router.navigate(['/job-board/professional/enrollment/', 'new']);
  }

  selectEnrollment(enrollment: EnrollmentModel) {
    this.selectedEnrollment = enrollment;
  }

  deleteEnrollment(enrollment: EnrollmentModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          this.subscriptions.push(this.uicHttpService.deleteEnrollment(enrollment.id!).subscribe(
            response => {
              this.removeEnrollment(enrollment);
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

  deleteEnrollments(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          const ids = this.selectedEnrollments.map(element => element.id);
          this.subscriptions.push(this.uicHttpService.deleteEnrollments(ids).subscribe(
            response => {
              this.removeEnrollments(ids!);
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

  removeEnrollment(enrollment: EnrollmentModel) {
    this.enrollments = this.enrollments.filter(element => element.id !== enrollment.id);
    this.paginator.total = this.paginator.total - 1;
  }

  removeEnrollments(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.enrollment = this.enrollments.filter(element => element.id !== id);
      this.paginator.total = this.paginator.total - 1;
    }
    this.selectedEnrollments = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadEnrollments();
  }

  setCols() {
    this.cols = [
      {field: 'modality', header: 'Modalidad'},
      {field: 'registeredAt', header: 'Fecha de resgistro '},
      {field: 'senescytCode', header: 'Código de Senescyt'},
      {field: 'certificated', header: '¿Titulado?'},
      {field: 'updatedAt', header: 'Última actualización'},
    ];

  }

  setItems() {
    this.items = [
      {
        label: 'Modificar', icon: 'pi pi-pencil', command: () => {
          this.editEnrollment(this.selectedEnrollment);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteEnrollment(this.selectedEnrollment);
        }
      }
    ];
  }
}
