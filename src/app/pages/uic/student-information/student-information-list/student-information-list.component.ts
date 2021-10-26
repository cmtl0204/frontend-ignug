import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {UicHttpService, UicService} from '@services/job-board';
import {MessageService} from '@services/core';
import {StudentInformationModel,} from '@models/job-board';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-academic-formation-list',
  templateUrl: './academic-formation-list.component.html',
  styleUrls: ['./academic-formation-list.component.scss']
})

export class StudentInformationListComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  progressBarDelete: boolean = false;
  studenInformations: StudentInformationModel[] = [];
  selectedStudentInformaton: StudentInformationModel = {};
  selectedStudentInformatons: StudentInformationModel[] = [];

  constructor(private router: Router,
              private breadcrumbService: BreadcrumbService,
              public messageService: MessageService,
              private uicHttpService: UicHttpService,
              private uicService: UicService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Formación académica', disabled: true},
    ]);

    this.filter = new FormControl('');
  }

  ngOnInit(): void {
    this.setCols();
    this.setItems();
    this.loadStudentInformations();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadStudentInformations() {
    this.loading = true;
    this.subscriptions.push(
      this.uicHttpService.getStudentInformations(this.paginator, this.filter.value).subscribe(
        response => {
          this.loading = false;
          this.studenInformations = response.data;
          this.paginator = response.meta;
        }, error => {
          this.loading = false;
          this.messageService.error(error);
        }
      ));
  }

  filterStudentInformations(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadStudentInformations();
    }
  }

  editStudentInformation(studentInformation: StudentInformationModel) {
    this.router.navigate(['/job-board/professional/academic-formation/', studentInformation.id]);
  }

  createStudentInformation() {
    this.router.navigate(['/job-board/professional/academic-formation/', 'new']);
  }

  selectStudentInformation(studentInformation: StudentInformationModel) {
    this.selectedStudentInformaton = studentInformation;
  }

  deleteStudentInformation(studentInformation: StudentInformationModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          this.subscriptions.push(this.uicHttpService.deleteStudentInformation(studentInformation.id!, this.uicService.professional?.id!).subscribe(
            response => {
              this.removeStudentInformation(studentInformation);
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

  deleteStudentInformations(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          const ids = this.selectedStudentInformatons.map(element => element.id);
          this.subscriptions.push(this.uicHttpService.deleteStudentInformations(ids).subscribe(
            response => {
              this.removeStudentInformations(ids!);
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

  removeStudentInformation(studentInformation: StudentInformationModel) {
    this.studenInformations = this.studenInformations.filter(element => element.id !== studentInformation.id);
    this.paginator.total = this.paginator.total - 1;
  }

  removeStudentInformations(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.studenInformations = this.studenInformations.filter(element => element.id !== id);
      this.paginator.total = this.paginator.total - 1;
    }
    this.selectedStudentInformatons = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadStudentInformations();
  }

  setCols() {
    this.cols = [
      {field: 'professionalDegree', header: 'Título'},
      {field: 'registeredAt', header: 'Fecha de registro'},
      {field: 'senescytCode', header: 'Código de Senescyt'},
      {field: 'certificated', header: '¿Está titulado?'},
      {field: 'updatedAt', header: 'Última actualización'},
    ];
  }

  setItems() {
    this.items = [
      {
        label: 'Modificar', icon: 'pi pi-pencil', command: () => {
          this.editStudentInformation(this.selectedStudentInformaton);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteStudentInformation(this.selectedStudentInformaton);
        }
      }
    ];
  }
}
