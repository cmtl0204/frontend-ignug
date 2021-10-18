import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProfessionalComponent} from './professional.component';
import {CourseComponent} from './course/course.component';
import {CourseFormComponent} from './course/course-form/course-form.component';
import {ExitGuard} from '@shared/guards/exit.guard';
import {ExperienceComponent} from './experience/experience.component';
import {ExperienceFormComponent} from './experience/experience-form/experience-form.component';
import {LanguageFormComponent} from './language/language-form/language-form.component';
import {LanguageComponent} from './language/language.component';
import {ReferenceComponent} from "./reference/reference.component";
import {ReferenceFormComponent} from "./reference/reference-form/reference-form.component";
import {SkillComponent} from "./skill/skill.component";
import {SkillFormComponent} from "./skill/skill-form/skill-form.component";
import {AcademicFormationComponent} from "./academic-formation/academic-formation.component";
import {AcademicFormationFormComponent} from "./academic-formation/academic-formation-form/academic-formation-form.component";
import {ProfileComponent} from "./profile/profile.component";

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
    path: ':activeIndex',
    component: ProfessionalComponent,
    // canActivate: [RoleGuard],
    // data: {
    //   roles: [RolesEnum.ADMIN, RolesEnum.GUEST]
    // },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canDeactivate: [ExitGuard]
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
    component: AcademicFormationComponent,
  },
  {
    path: 'academic-formation/:id',
    component: AcademicFormationFormComponent,
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionalRoutingModule {
}
