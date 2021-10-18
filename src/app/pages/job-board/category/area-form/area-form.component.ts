import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {JobBoardHttpService} from '@services/job-board';
import {CategoryModel} from '@models/job-board';

@Component({
  selector: 'app-area-form',
  templateUrl: './area-form.component.html',
  styleUrls: ['./area-form.component.scss']
})

export class AreaFormComponent implements OnInit, OnDestroy, OnExitInterface {

  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  skeletonLoading: boolean = false;
  title: string = 'Crear Área de Estudio';
  buttonTitle: string = 'Crear Área de Estudio';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private jobBoardHttpService: JobBoardHttpService) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Áreas de Estudio', routerLink: ['/job-board/category']},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar Área de Estudio';
      this.buttonTitle = 'Actualizar Área de Estudio';
      this.loadCategory();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  async onExit() {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit({})
        .then((result) => {
          return result.isConfirmed;
        });
    }
    return true;
  }

  newForm(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      parent: [null],
      code: [null],
      icon: [null],
    });
  }

  loadCategory(): void {
    this.skeletonLoading = true;
    this.subscriptions.push(
      this.jobBoardHttpService
        .getCategory(this.activatedRoute.snapshot.params.id)
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

  onSubmit(): void {
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

  store(category: CategoryModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.jobBoardHttpService.storeArea(category)
        .subscribe(
          response => {
            this.messageService.success(response);
            this.form.reset();
            this.progressBar = false;
            this.router.navigate(['/job-board/category']);
          },
          error => {
            this.messageService.error(error);
            this.progressBar = false;
          }
        ));
  }

  update(category: CategoryModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.jobBoardHttpService.updateArea(category.id!, category)
        .subscribe(
          response => {
            this.messageService.success(response);
            this.progressBar = false;
            this.form.reset();
            this.router.navigate(['/job-board/category']);
          },
          error => {
            this.messageService.error(error);
            this.progressBar = false;
          }
        ));
  }

  isRequired(field: AbstractControl): boolean {
    return field.hasValidator(Validators.required);
  }

  get idField() {
    return this.form.controls['id'];
  }

  get parentField() {
    return this.form.controls['parent'];
  }

  get codeField() {
    return this.form.controls['code'];
  }

  get nameField() {
    return this.form.controls['name'];
  }

  get iconField() {
    return this.form.controls['icon'];
  }
}
