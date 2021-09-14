import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProfessionalComponent} from './professional.component';
import {CourseComponent} from './course/course.component';
import {CourseFormComponent} from './course/course-form/course-form.component';
import {ExitGuard} from '@shared/guards/exit.guard';

const routes: Routes = [
  {
    path: '',
    component: ProfessionalComponent,
    // canActivate: [RoleGuard],
    // data: {
    //   roles: [RolesEnum.ADMIN, RolesEnum.GUEST]
    // },
  },
  {
    path: 'course',
    component: CourseComponent,
  },
  {
    path: 'course/:id',
    component: CourseFormComponent,
    canDeactivate: [ExitGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionalRoutingModule {
}
