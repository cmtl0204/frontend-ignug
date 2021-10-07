import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {JobBoardHttpService} from '@services/job-board';
import {CategoryModel} from '@models/job-board';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, OnDestroy, OnExitInterface {

  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  skeletonLoading: boolean = false;
  title: string = 'Crear evento';
  buttonTitle: string = 'Crear evento';
  areas: CategoryModel[] = [];
  professionalDegrees: CategoryModel[] = [];
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private jobBoardHttpService: JobBoardHttpService) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Categorías', routerLink: ['/job-board/professional/category']},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar categoría';
      this.buttonTitle = 'Actualizar categoría';
      this.loadCategory();
      this.form.markAllAsTouched();
    }
    this.loadAreas();
    this.loadProfessionalDegrees();
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

  loadCategory():void {
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

  newForm(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      parent: [null],
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      icon: [null, [Validators.required]],
    });
  }

  // ForeignKeys
  loadAreas() {
    this.jobBoardHttpService.getAreas()
      .subscribe(
      response => {
        this.areas = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  loadProfessionalDegrees() {
    this.jobBoardHttpService.getProfessionalDegrees()
    .subscribe(
      response => {
        this.professionalDegrees = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }
  
  onSubmit():void {
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
    this.jobBoardHttpService.storeCategory(category).subscribe(
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
    );
  }

  update(category: CategoryModel): void {
    this.progressBar = true;
    this.jobBoardHttpService.updateCategory(category.id!, category)
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
    );
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
