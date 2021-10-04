import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CatalogueModel, UserModel } from '@models/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from '@services/core/breadcrumb.service';
import { UserAdministrationHttpService } from '@services/core/user-administration-http.service';
import { JobBoardHttpService, JobBoardService } from '@services/job-board';
import { CoreService } from '@services/core/core.service';
import { MessageService } from '@services/core';
import { AcademicFormationModel, CategoryModel, CourseModel } from '@models/job-board';
import { OnExitInterface } from '@shared/interfaces/on-exit.interface';

@Component({
  selector: 'app-academic-formation-form',
  templateUrl: './academic-formation-form.component.html',
  styleUrls: ['./academic-formation-form.component.scss']
})
export class AcademicFormationFormComponent implements OnInit, OnDestroy, OnExitInterface {
  @Input() user: UserModel = {};
  @Output() userNewOrUpdate = new EventEmitter<UserModel>();

  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  professionalDegrees: CategoryModel[] = [];
  skeletonLoading: boolean = false;
  title: string = 'Crear evento';
  buttonTitle: string = 'Crear evento';

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private formBuilder: FormBuilder,
    private userAdministrationHttpService: UserAdministrationHttpService,
    private jobBardHttpService: JobBoardHttpService,
    private jobBardService: JobBoardService,
    private appService: CoreService,
    public messageService: MessageService,
    private activatedRoute: ActivatedRoute) {
    this.breadcrumbService.setItems([
      { label: 'Dashboard', routerLink: ['/dashboard'] },
      { label: 'Profesional', routerLink: ['/job-board/professional'] },
      { label: 'Formación Académica', routerLink: ['/job-board/professional/academic-formation'] },
      { label: 'Formulario', disabled: true },
    ]);
    this.form = this.newForm();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.id != 'new') {
      this.title = 'Actualizar formación académica';
      this.buttonTitle = 'Actualizar formación académica';
      this.getAcademicFormation();
      this.form.markAllAsTouched();
    }
    this.getProfessionalDegrees();
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

  loadAcademicFormation() {
    this.skeletonLoading = true;
    this.subscriptions.push(this.jobBardHttpService.getAcademicFormation(this.jobBardService.professional.id!, this.activatedRoute.snapshot.params.id).subscribe(
      response => {
        response.data.registeredAt = new Date('2021-08-22');
        response.data.registeredAt.setDate(response.data.registeredAt.getDate() + 1);

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
      professionalDegree: [null, [Validators.required]],
      registeredAt: [null, [Validators.required]],
      senescytCode: [null, [Validators.required]],
      certificated: [null, [Validators.required]],
    });
  }

  getProfessionalDegrees() {
    this.jobBardHttpService.getProfessionalDegrees()
      .subscribe(
        response => {
          this.professionalDegrees = response.data;
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

  store(academicFormation: AcademicFormationModel): void {
    this.progressBar = true;
    this.jobBardHttpService.storeAcademicFormation(academicFormation, this.jobBardService.professional.id!).subscribe(
      response => {
        this.messageService.success(response);
        this.form.reset();
        this.userNewOrUpdate.emit(academicFormation);
        this.progressBar = false;
        this.router.navigate(['/job-board/professional/academic-formation']);
      },
      error => {
        this.messageService.error(error);
        this.progressBar = false;
      }
    );
  }

  update(academicFormation: AcademicFormationModel): void {
    this.progressBar = true;
    this.jobBardHttpService.updateAcademicFormation(academicFormation.id!, academicFormation, this.jobBardService.professional.id!).subscribe(
      response => {
        this.messageService.success(response);
        this.form.reset();
        this.userNewOrUpdate.emit(academicFormation);
        this.progressBar = false;
        this.router.navigate(['/job-board/professional/academicFormation']);
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

  get professionalDegreeField() {
    return this.form.controls['type'];
  }

  get registeredAtField() {
    return this.form.controls['certificationType'];
  }

  get senescytCodeField() {
    return this.form.controls['area'];
  }

  get certificatedField() {
    return this.form.controls['name'];
  }
}

