import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {CustomHttpService} from '@services/custom';
import {ExampleModel} from '@models/custom';

@Component({
  selector: 'app-category-form',
  templateUrl: './example-form.component.html',
  styleUrls: ['./example-form.component.scss']
})

export class ExampleFormComponent implements OnInit, OnDestroy, OnExitInterface {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  loadingSkeleton: boolean = false;
  title: string = 'Crear Custom';
  buttonTitle: string = 'Crear Custom';
  yearRange: string = `1900:${(new Date()).getFullYear()}`;
  //areas: AreaModel[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private customHttpService: CustomHttpService) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar Custom';
      this.buttonTitle = 'Actualizar Custom';
      this.loadCustom();
    }
    // this.loadAreas();
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
      professionalDegree: [null, [Validators.required]],
      certificated: [false, [Validators.required]],
      observations: [null],
      registeredAt: [null],
    });
  }

  loadCustom(): void {
    this.loadingSkeleton = true;
    this.subscriptions.push(
      this.customHttpService
        .getCustom(this.activatedRoute.snapshot.params.id)
        .subscribe(
          response => {
            this.form.patchValue(response.data);
            this.loadingSkeleton = false;
          }, error => {
            this.loadingSkeleton = false;
            this.messageService.error(error);
          }
        ));
  }

  // Example for foreign keys
  // loadAreas() {
  //   this.subscriptions.push(
  //     this.customHttpService.getAreas()
  //       .subscribe(
  //         response => {
  //           this.areas = response.data;
  //         }, error => {
  //           this.messageService.error(error);
  //         }
  //       ));
  // }

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

  store(example: ExampleModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.customHttpService.storeCustom(example)
        .subscribe(
          response => {
            this.messageService.success(response);
            this.form.reset();
            this.progressBar = false;
            this.returnList();
          },
          error => {
            this.messageService.error(error);
            this.progressBar = false;
          }
        ));
  }

  update(example: ExampleModel): void {
    this.progressBar = true;
    this.subscriptions.push(
      this.customHttpService.updateCustom(example.id!,example)
        .subscribe(
          response => {
            this.messageService.success(response);
            this.progressBar = false;
            this.form.reset();
            this.returnList();
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
  returnList() {
    this.router.navigate(['/job-board/professional', 2]);
  }
  get idField() {
    return this.form.controls['id'];
  }

  get nameField() {
    return this.form.controls['name'];
  }

  get registeredAtField() {
    return this.form.controls['registeredAt'];
  }

  get certificatedField() {
    return this.form.controls['certificated'];
  }

  get observationsField() {
    return this.form.controls['observations'];
  }
}
