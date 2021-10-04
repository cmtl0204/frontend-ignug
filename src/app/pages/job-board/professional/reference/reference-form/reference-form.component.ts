import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {JobBoardHttpService, JobBoardService} from '@services/job-board';
import {CatalogueModel} from '@models/core';
import {ReferenceModel} from '@models/job-board';

@Component({
  selector: 'app-reference-form',
  templateUrl: './reference-form.component.html',
  styleUrls: ['./reference-form.component.scss']
})
export class ReferenceFormComponent implements OnInit, OnDestroy, OnExitInterface {

  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  types: CatalogueModel[] = [];
  certificationTypes: CatalogueModel[] = [];
  areas: CatalogueModel[] = [];
  skeletonLoading: boolean = false;
  title: string = 'Crear referencia';
  buttonTitle: string = 'Crear referencia';
  coreHttpService: any;
  userAdministrationHttpService: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private jobBoardHttpService: JobBoardHttpService,
    private jobBoardService: JobBoardService
    ) {
    this.breadcrumbService.setItems([
      {label: 'Dashboard', routerLink: ['/dashboard']},
      {label: 'Profesional', routerLink: ['/job-board/professional']},
      {label: 'Referencias profesionales', routerLink: ['/job-board/professional/reference']},
      {label: 'Formulario', disabled: true},
    ]);
    this.form = this.newForm();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar referencias';
      this.buttonTitle = 'Actualizar referencias';
      this.getReference();
      this.form.markAllAsTouched();
    }
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

  getReference() {
    this.skeletonLoading = true;
    this.subscriptions.push(this.jobBoardHttpService.getReference(this.jobBoardService.professional.id!, this.activatedRoute.snapshot.params.id).subscribe(
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
      position: [null, [Validators.required]],
      contactName: [null, [Validators.required]],
      contact_phone: [null, [Validators.required]],
      contact_email: [null, [Validators.required]],
      institution: [null, [Validators.required]],
    });
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

  store(reference: ReferenceModel): void {
    this.progressBar = true;
    this.coreHttpService.storeReference(reference.id!, reference, this.jobBoardService.professional.id!).subscribe(
      response => {
        this.messageService.success(response);
        this.progressBar = false;
        this.form.reset();
        this.router.navigate(['/job-board/professional/reference']);
      },
      error => {
        this.messageService.error(error);
        this.progressBar = false;
      }
    );
  }

  update(reference: ReferenceModel): void {
    this.progressBar = true;
    this.jobBoardHttpService.updateReference(reference.id!, reference, this.jobBoardService.professional.id!)
      .subscribe(
      response => {
        this.messageService.success(response);
        this.progressBar = false;
        this.form.reset();
        this.router.navigate(['/job-board/professional/reference']);
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

  get positionField() {
    return this.form.controls['position'];
  }

  get contactNameField() {
    return this.form.controls['contact_name'];
  }

  get contactPhoneField() {
    return this.form.controls['contact_phone'];
  }

  get contactEmailField() {
    return this.form.controls[' contact_email'];
  }

  get institutionField() {
    return this.form.controls['institution'];
  }
}
