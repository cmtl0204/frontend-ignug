import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {ColModel, PaginatorModel} from '@models/core';
import {SkillModel} from '@models/job-board';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.scss']
})

export class SkillListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  cols: ColModel[] = [];
  items: MenuItem[] = [];
  loading: boolean = false;
  paginator: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  filter: FormControl;
  skills: SkillModel[] = [];
  selectedSkill: SkillModel = {};
  selectedSkills: SkillModel[] = [];
  progressBarDelete: boolean = false;

  constructor(private router: Router,
              private breadcrumbService: BreadcrumbService,
              public messageService: MessageService,
              private jobBoardHttpService: JobBoardHttpService,
              private jobBoardService: JobBoardService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Habilidades', disabled: true},
    ]);

    this.filter = new FormControl('');
  }

  ngOnInit(): void {
    this.setCols();
    this.setItems();
    this.loadSkills();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadSkills() {
    this.loading = true;
    this.subscriptions.push(
      this.jobBoardHttpService.getSkills(this.jobBoardService.professional.id!, this.paginator, this.filter.value)
        .subscribe(
          response => {
            this.loading = false;
            this.skills = response.data;
            this.paginator = response.meta;
          }, error => {
            this.loading = false;
            this.messageService.error(error);
          }
        ));
  }

  filterSkills(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadSkills();
    }
  }

  editSkill(skill: SkillModel) {
    this.router.navigate(['/job-board/professional/skill/', skill.id]);
  }

  createSkill() {
    this.router.navigate(['/job-board/professional/skill/', 'new']);
  }

  selectSkill(skill: SkillModel) {
    this.selectedSkill = skill;
  }

  deleteSkill(skill: SkillModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          this.subscriptions.push(
            this.jobBoardHttpService.deleteSkill(skill.id!, this.jobBoardService.professional?.id!)
              .subscribe(
                response => {
                  this.removeSkill(skill);
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

  deleteSkills(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.progressBarDelete = true;
          const ids = this.selectedSkills.map(element => element.id);
          this.subscriptions.push(this.jobBoardHttpService.deleteSkills(ids).subscribe(
            response => {
              this.removeSkills(ids!);
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

  removeSkill(skill: SkillModel) {
    this.skills = this.skills.filter(element => element.id !== skill.id);
    this.paginator.total = this.paginator.total - 1;
  }

  removeSkills(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.skills = this.skills.filter(element => element.id !== id);
      this.paginator.total = this.paginator.total - 1;
    }
    this.selectedSkills = [];
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadSkills();
  }

  setCols() {
    this.cols = [
      {field: 'type', header: 'Tipo'},
      {field: 'description', header: 'Descripción'},
      {field: 'updatedAt', header: 'Última actualización'},
    ];
  }

  setItems() {
    this.items = [
      {
        label: 'Modificar', icon: 'pi pi-pencil', command: () => {
          this.editSkill(this.selectedSkill);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteSkill(this.selectedSkill);
        }
      }
    ];
  }
}
