import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {UicHttpService, UicService} from '@services/uic';
import {MessageService} from '@services/core';
import {EventModel,} from '@models/uic';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-event-list',
  templateUrl: './academic-event-list.component.html',
  styleUrls: ['./academic-event-list.component.scss']
})

export class EventListComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  progressBarDelete: boolean = false;
  events: EventModel[] = [];
  event: EventModel = {};
  events: EventModel[] = [];

  constructor(private router: Router,
              private breadcrumbService: BreadcrumbService,
              public messageService: MessageService,
              private jobBoardHttpService: UicHttpService,
              private jobBoardService: UicService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/uic/professional']},
      {label: 'Evento', disabled: true},
    ]);

    this.filter = new FormControl('');
  }

  ngOnInit(): void {
    this.setCols();
    this.setItems();
    this.loadEvents();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadEvents() {
    this.loading = true;
    this.subscriptions.push(
      this.uicHttpService.getEvents(this.paginator, this.filter.value).subscribe(
        response => {
          this.loading = false;
          this.events = response.data;
          this.paginator = response.meta;
        }, error => {
          this.loading = false;
          this.messageService.error(error);
        }
      ));
  }

  filterEvents(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadEvents();
    }
  }

  editEvent(event: EventModel) {
    this.router.navigate(['/uic/professional/event/', event.id]);
  }

  createEvent() {
    this.router.navigate(['/uic/professional/event/', 'new']);
  }

  selectEvent(event: EventModel) {
    this.selectedEvent = event;
  }

  deleteEvent(event: EventModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          this.subscriptions.push(this.uicHttpService.deleteEvent(event.id!).subscribe(
            response => {
              this.removeEvent(event);
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

  deleteEvents(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          const ids = this.selectedEvent.map(element => element.id);
          this.subscriptions.push(this.uicHttpService.deleteEvents(ids).subscribe(
            response => {
              this.removeEvents(ids!);
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

  removeEvent(event: EventModel) {
    this.events = this.events.filter(element => element.id !== event.id);
    this.paginator.total = this.paginator.total - 1;
  }

  removeEvents(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.events = this.events.filter(element => element.id !== id);
      this.paginator.total = this.paginator.total - 1;
    }
    this.selectedEvents = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadEvents();
  }

  setCols() {
    this.cols = [
      {field: 'planning', header: 'Planificación'},
      {field: 'name', header: 'Nombre'},
      {field: 'startedAt', header: 'Fecha de Inicio'},
      {field: 'endedAt', header: 'Fecha Fin'},
      {field: 'updatedAt', header: 'Última actualización'},
    ];
  }

  setItems() {
    this.items = [
      {
        label: 'Modificar', icon: 'pi pi-pencil', command: () => {
          this.editEvent(this.selectedEvent);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteEvent(this.selectedEvent);
        }
      }
    ];
  }
}
