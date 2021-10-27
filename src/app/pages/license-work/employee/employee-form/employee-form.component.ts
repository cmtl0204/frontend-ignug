import { Component, OnInit,OnDestroy, } from '@angular/core';
import {OnExitInterface} from '@shared/interfaces/on-exit.interface';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BreadcrumbService} from '@services/core/breadcrumb.service';
import {MessageService} from '@services/core';
import {LicenseWorkHttpService, LicenseWorkService} from '@services/license-work';
import {EmployeeModel,userIdModel} from '@models/license-work';
@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit,OnDestroy,OnExitInterface {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  progressBar: boolean = false;
  skeletonLoading: boolean = false;
  title: string = 'Crear Empleados';
  buttonTitle: string = 'Crear Empleados';
  userId: userIdModel[] = [];


  constructor( private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private licenseWorkHttpService: LicenseWorkHttpService,
    private licenseWorkService: LicenseWorkService) 
    
    {
     this.breadcrumbService.setItems([
        {label: 'Dashboard', routerLink: ['/dashboard']},
        {label: 'Formulario de empleados', disabled: true},
      ]);
      this.form = this.newForm();
      
     }

     ngOnInit(): void {
      if (this.activatedRoute.snapshot.params.id != 'new') {
        this.title = 'Actualizar Empleados';
        this.buttonTitle = 'Actualizar Empleados';
        this.loadEmployee();
      }
      this.loadUserId();
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
       userId: [null, [Validators.required]],
      });
 }

 loadEmployee() {
  this.skeletonLoading = true;
  this.subscriptions.push(
    this.licenseWorkHttpService
      .getEmployee( this.activatedRoute.snapshot.params.id)
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

loadUserId() {
  this.subscriptions.push(
    this.licenseWorkHttpService.getUserId()
      .subscribe(
        response => {
          this.userId = response.data;
        }, error => {
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

store(employee: EmployeeModel): void {
  this.progressBar = true;
  this.subscriptions.push(
    this.licenseWorkHttpService.storeEmployee(employee)
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


update(employee: EmployeeModel): void {
  this.progressBar = true;
  this.subscriptions.push(
    this.licenseWorkHttpService.updateEmployee(employee.id!,employee)
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

isRequired(field: AbstractControl): boolean {
  return field.hasValidator(Validators.required);
}

returnList() {
  this.router.navigate(['/license-work/professional', 2]);//
}


get idField() {
  return this.form.controls['id'];
}

get userIdField() {
  return this.form.controls['userId'];
}


}

