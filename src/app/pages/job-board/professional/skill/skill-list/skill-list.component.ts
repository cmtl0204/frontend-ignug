import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {MessageService} from '@services/core';
import {SkillModel} from '@models/job-board';
import {ColModel, PaginatorModel} from '@models/core';
import {FormControl} from '@angular/forms';

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
      this.jobBoardHttpService.getSkills(this.jobBoardService.professional.id!, this.paginator, this.filter.value).subscribe(
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
          this.subscriptions.push(this.jobBoardHttpService.deleteSkill(this.jobBoardService.professional?.id!, skill.id!).subscribe(
            response => {
              this.removeSkill(skill);
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          ));
        }
      });
  }

  deleteSkills(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          const ids = this.selectedSkills.map(element => element.id);
          this.subscriptions.push(this.jobBoardHttpService.deleteSkills(ids).subscribe(
            response => {
              this.removeSkills(ids!);
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          ));
        }
      });

  }

  removeSkill(skill: SkillModel) {
    this.skills = this.skills.filter(element => element.id !== skill.id);
  }

  removeSkills(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.skills = this.skills.filter(element => element.id !== id);
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
      {field: 'updatedAt', header: 'Actualizado'},
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
