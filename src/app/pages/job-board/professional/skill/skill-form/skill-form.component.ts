import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {CoreHttpService} from '@services/core';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {CatalogueModel} from '@models/core';
import {SkillModel} from '@models/job-board';
@Component({
  selector: 'app-skill-form',
  templateUrl: './skill-form.component.html',
  styleUrls: ['./skill-form.component.scss']
})
export class SkillFormComponent implements OnInit , OnDestroy, OnExitInterface {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  types: CatalogueModel[] = [];
  certificationTypes: CatalogueModel[] = [];
  areas: CatalogueModel[] = [];
  skeletonLoading: boolean = false;
  title: string = 'Crear habilidades';
  buttonTitle: string = 'Crear habilidades';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private coreHttpService: CoreHttpService,
    private jobBoardHttpService: JobBoardHttpService,
    private jobBoardService: JobBoardService
    ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Habilidades', routerLink: ['/job-board/professional/skill']},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar habilidades';
      this.buttonTitle = 'Actualizar habilidades';
      this.loadSkill();
      this.form.markAllAsTouched();
    }

    this.getTypes();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  async onExit() {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit({}).then((result) => {
        return result.isConfirmed;
      });
    }
    return true;
  }

  loadSkill():void {
    this.skeletonLoading = true;
    this.subscriptions.push(
      this.jobBoardHttpService
        .getExperience(this.jobBoardService.professional.id!, this.activatedRoute.snapshot.params.id)
      .subscribe(
      response => {
        this.form.patchValue(response.data);
        this.skeletonLoading = false;
      }, error => {
        this.skeletonLoading = false;
        this.messageService.error(error);
      }
    ));
  }

  newForm(): FormGroup {
    return this.formBuilder.group({
      type: [null, [Validators.required]],
      description: [null, [Validators.minLength(10)]]
    });
  }

  getTypes() {
    this.coreHttpService.getCatalogues('SKILL_TYPE').subscribe(
      response => {
        this.types = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.idField.value) {
        this.update(this.form.value);
      } else {
        this.store(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  store(skill: SkillModel): void {
    this.progressBar = true;
    this.jobBoardHttpService.storeSkill(skill, this.jobBoardService.professional.id!).subscribe(
      response => {
        this.messageService.success(response);
        this.form.reset();
        this.progressBar = false;
        this.router.navigate(['/job-board/professional/skill']);
      },
      error => {
        this.messageService.error(error);
        this.progressBar = false;
      }
    );
  }

  update(skill: SkillModel): void {
    this.progressBar = true;
    this.jobBoardHttpService.updateSkill(skill.id!, skill, this.jobBoardService.professional.id!).subscribe(
      response => {
        this.messageService.success(response);
        this.form.reset();
        this.progressBar = false;
        this.router.navigate(['/job-board/professional/skill']);
      },
      error => {
        this.messageService.error(error);
        this.progressBar = false;
      }
    );
  }

  get idField() {
    return this.form.controls['id'];
  }

  get typeField() {
    return this.form.controls['type'];
  }

  get descriptionField() {
    return this.form.controls['description'];
  }

}
