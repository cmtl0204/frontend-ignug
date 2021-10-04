import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProfessionalComponent} from './professional.component';
import {CourseComponent} from './course/course.component';
import {CourseFormComponent} from './course/course-form/course-form.component';
import {ExitGuard} from '@shared/guards/exit.guard';
import { ExperienceComponent } from './experience/experience.component';
import { ExperienceFormComponent } from './Experience/experience-form/experience-form.component';
import { LanguageFormComponent } from './Language/language-form/language-form.component';
import { LanguageComponent } from './language/language.component';

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
  },
  {
    path: 'academic-formation',
    component: CourseComponent,
  },
  {
    path: 'academic-formation/:id',
    component: CourseFormComponent,
    canDeactivate: [ExitGuard]
  },
  {
    path: 'experience',
    component: ExperienceComponent,
  },
  {
    path: 'experience/:id',
    component: ExperienceFormComponent,
    canDeactivate: [ExitGuard]
  },
  {
    path: 'language',
    component: LanguageComponent,
  },
  {
    path: 'language/:id',
    component: LanguageFormComponent,
    canDeactivate: [ExitGuard]
  },
  {
    path: 'reference',
    component: ReferenceComponent,
  },
  {
    path: 'reference/:id',
    component: ReferenceFormComponent,
    canDeactivate: [ExitGuard]
  },
  {
    path: 'skill',
    component: SkillComponent,
  },
  {
    path: 'skill/:id',
    component: SkillFormComponent,
    canDeactivate: [ExitGuard]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionalRoutingModule {
}
