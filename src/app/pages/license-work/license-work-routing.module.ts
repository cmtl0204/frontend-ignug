import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards/exit.guard";
import {ApplicationComponent} from "./application/application.component";
import {ApplicationFormComponent} from "./application/application-form/application-form.component";
import { EmployerComponent } from './employer/employer.component';
import { EmployerFormComponent } from './employer/employer-form/employer-form.component';
import { HolidayComponent } from './holiday/holiday.component';
import { HolidayFormComponent } from './holiday/holiday-form/holiday-form.component';
import { FormComponent } from './form/form.component';
import { FormFormComponent } from './form/form-form/form-form.component';


const routes: Routes = [
  {
    path: 'application',
    component: ApplicationComponent,
  },
  {
    path: 'application/:id',
    component: ApplicationFormComponent,
    canDeactivate: [ExitGuard]
  },
  {
    path: 'employer',
    component: EmployerComponent,
  },
  {
    path: 'employer/:id',
    component: EmployerFormComponent,
    canDeactivate: [ExitGuard]
  },
  {
    path: 'form',
    component: FormComponent,
  },
  {
    path: 'form/:id',
    component: FormFormComponent,
    canDeactivate: [ExitGuard]
  },
  {
    path: 'holiday',
    component: HolidayComponent,
  },
  {
    path: 'holiday/:id',
    component: HolidayFormComponent,
    canDeactivate: [ExitGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicenseWorkRoutingModule {
}