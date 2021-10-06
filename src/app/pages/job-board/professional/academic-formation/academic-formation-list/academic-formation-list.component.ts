import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {MessageService} from '@services/core';
import {AcademicFormationModel, } from '@models/job-board';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-academic-formation-list',
  templateUrl: './academic-formation-list.component.html',
  styleUrls: ['./academic-formation-list.component.scss']
})

export class AcademicFormationListComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;

  academicFormations: AcademicFormationModel[] = [];
  selectedAcademicFormation: AcademicFormationModel= {};
  selectedAcademicFormations: AcademicFormationModel[] = [];

  constructor(private router: Router,
             private breadcrumbService: BreadcrumbService,
             public messageService: MessageService,
             private jobBoardHttpService: JobBoardHttpService,
             private jobBoardService: JobBoardService,
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
    this.loadAcademicFormations();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadAcademicFormations() {
    this.loading = true;
    this.subscriptions.push(
      this.jobBoardHttpService.getAcademicFormations(this.jobBoardService.professional.id!, this.paginator, this.filter.value).subscribe(
        response => {
          this.loading = false;
          this.academicFormations = response.data;
          this.paginator = response.meta;
        }, error => {
          this.loading = false;
          this.messageService.error(error);
        }
      ));
  }

  filterAcademicFormations(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadAcademicFormations();
    }
  }

  editAcademicFormation(user: AcademicFormationModel) {
    this.router.navigate(['/job-board/professional/academic-formation/', user.id]);
  }

  createAcademicFormation() {
    this.router.navigate(['/job-board/professional/academic-formation/', 'new']);
  }

  selectAcademicFormation(academicFormation: AcademicFormationModel) {
    this.selectedAcademicFormation = academicFormation;
  }

  deleteAcademicFormation(academicFormation: AcademicFormationModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.subscriptions.push(this.jobBoardHttpService.deleteAcademicFormation(this.jobBoardService.professional?.id!, academicFormation.id!).subscribe(
            response => {
              this.removeAcademicFormation(academicFormation);
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          ));
        }
      });
  }

  deleteAcademicFormations(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          const ids = this.selectedAcademicFormations.map(element => element.id);
          this.subscriptions.push(this.jobBoardHttpService.deleteAcademicFormations(ids).subscribe(
            response => {
              this.removeAcademicFormations(ids!);
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          ));
        }
      });

  }

  removeAcademicFormation(academicFormation: AcademicFormationModel) {
    this.academicFormations = this.academicFormations.filter(element => element.id !== academicFormation.id);
  }

  removeAcademicFormations(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.academicFormations = this.academicFormations.filter(element => element.id !== id);
    }
    this.selectedAcademicFormations = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadAcademicFormations();
  }

  setCols() {
    this.cols = [
      {field: 'professionalDegree', header: 'Títulos'},
      {field: 'registeredAt', header: 'Fecha de resgistro '},
      {field: 'senescytCode', header: 'Código de Senescyt'},
      {field: 'certificated', header: 'Graduado'},
    ];

  }

  setItems() {
    this.items = [
      {
        label: 'Modificar', icon: 'pi pi-pencil', command: () => {
          this.editAcademicFormation(this.selectedAcademicFormation);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteAcademicFormation(this.selectedAcademicFormation);
        }
      }
    ];
  }
}
