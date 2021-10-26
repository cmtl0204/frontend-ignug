import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {UicBoardHttpService, UicService} from '@services/uic';
import {MessageService} from '@services/core';
import {TutorModel,} from '@models/uic';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-tutor-list',
  templateUrl: './tutor-list.component.html',
  styleUrls: ['./tutor-list.component.scss']
})

export class TutorListComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  progressBarDelete: boolean = false;
  tutors: TutorModel[] = [];
  selectedTutor: TutorModel = {};
  selectedTutors: TutorModel[] = [];

  constructor(private router: Router,
              private breadcrumbService: BreadcrumbService,
              public messageService: MessageService,
              private uicHttpService: UicHttpService,
              private uicService: UicService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Tutor', disabled: true},
    ]);

    this.filter = new FormControl('');
  }

  ngOnInit(): void {
    this.setCols();
    this.setItems();
    this.loadTutors();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadTutors() {
    this.loading = true;
    this.subscriptions.push(
      this.uicHttpService.getTutors( this.paginator, this.filter.value).subscribe(
        response => {
          this.loading = false;
          this.tutors = response.data;
          this.paginator = response.meta;
        }, error => {
          this.loading = false;
          this.messageService.error(error);
        }
      ));
  }

  filterTutors(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadTutors();
    }
  }

  editTutor(tutor: TutorModel) {
    this.router.navigate(['/uic/professional/tutor/', tutor.id]);
  }

  createTutor() {
    this.router.navigate(['/uic/professional/tutor/', 'new']);
  }

  selectTutor(tutor: TutorModel) {
    this.selectedTutor = tutor;
  }

  deleteTutor(tutor: TutorModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          this.subscriptions.push(this.uicHttpService.deleteTutor(tutor.id!).subscribe(
            response => {
              this.removeTutor(tutor);
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

  deleteTutors(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          const ids = this.selectedTutors.map(element => element.id);
          this.subscriptions.push(this.uicHttpService.deleteTutors(ids).subscribe(
            response => {
              this.removeTutors(ids!);
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

  removeTutor(tutor: TutorModel) {
    this.tutors = this.tutors.filter(element => element.id !== tutor.id);
    this.paginator.total = this.paginator.total - 1;
  }

  removeTutors(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.tutors = this.tutors.filter(element => element.id !== id);
      this.paginator.total = this.paginator.total - 1;
    }
    this.selectedTutors = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadTutors();
  }

  setCols() {
    this.cols = [
      {field: 'projectPlan', header: 'Plan de proyecto'},
      {field: 'teacher', header: 'Profesor'},
      {field: 'type', header: 'Cargo'},
      {field: 'observations', header: 'Observaciónes'},
    ];
  }

  setItems() {
    this.items = [
      {
        label: 'Modificar', icon: 'pi pi-pencil', command: () => {
          this.editTutor(this.selectedTutor);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteTutor(this.selectedTutor);
        }
      }
    ];
  }
}
