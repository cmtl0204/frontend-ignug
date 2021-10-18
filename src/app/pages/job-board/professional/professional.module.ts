import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProfessionalRoutingModule} from './professional-routing.module';
import {ProfileComponent} from './profile/profile.component';
import {ProfessionalComponent} from './professional.component';
import {CourseComponent} from './course/course.component';
import {CourseListComponent} from './course/course-list/course-list.component';
import {CourseFormComponent} from './course/course-form/course-form.component';
import {TabViewModule} from 'primeng/tabview';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {SplitButtonModule} from 'primeng/splitbutton';
import {DialogModule} from 'primeng/dialog';
import {CardModule} from 'primeng/card';
import {PaginatorModule} from 'primeng/paginator';
import {DividerModule} from 'primeng/divider';
import {ProgressBarModule} from 'primeng/progressbar';
import {ReactiveFormsModule} from '@angular/forms';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';
import {InputNumberModule} from 'primeng/inputnumber';
import {SharedModule} from '@shared/shared.module';
import {ToolbarModule} from 'primeng/toolbar';

import { SkillComponent } from './skill/skill.component';
import { SkillFormComponent } from './skill/skill-form/skill-form.component';
import { SkillListComponent } from './skill/skill-list/skill-list.component';
import { ReferenceComponent } from './reference/reference.component';
import { ReferenceFormComponent } from './reference/reference-form/reference-form.component';
import { ReferenceListComponent } from './reference/reference-list/reference-list.component';
import { ExperienceComponent } from './experience/experience.component';
import { ExperienceFormComponent } from './experience/experience-form/experience-form.component';
import { ExperienceListComponent } from './experience/experience-list/experience-list.component';
import { LanguageComponent } from './language/language.component';
import { LanguageFormComponent } from './language/language-form/language-form.component';
import { LanguageListComponent } from './language/language-list/language-list.component';
import { AcademicFormationComponent } from './academic-formation/academic-formation.component';
import { AcademicFormationFormComponent } from './academic-formation/academic-formation-form/academic-formation-form.component';
import { AcademicFormationListComponent } from './academic-formation/academic-formation-list/academic-formation-list.component';
import {KeyFilterModule} from "primeng/keyfilter";
import {InputTextareaModule} from "primeng/inputtextarea";
import {TooltipModule} from "primeng/tooltip";
import {StepsModule} from "primeng/steps";

@NgModule({
  declarations: [
    ProfessionalComponent,
    ProfileComponent,
    CourseComponent,
    CourseListComponent,
    CourseFormComponent,
    SkillComponent,
    SkillFormComponent,
    SkillListComponent,
    ReferenceComponent,
    ReferenceFormComponent,
    ReferenceListComponent,
    ExperienceComponent,
    ExperienceFormComponent,
    ExperienceListComponent,
    LanguageComponent,
    LanguageFormComponent,
    LanguageListComponent,
    AcademicFormationComponent,
    AcademicFormationFormComponent,
    AcademicFormationListComponent,
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ProfessionalRoutingModule,
        SharedModule,
        TabViewModule,
        TableModule,
        ButtonModule,
        RippleModule,
        SplitButtonModule,
        DialogModule,
        CardModule,
        PaginatorModule,
        DividerModule,
        ProgressBarModule,
        InputSwitchModule,
        InputTextModule,
        CalendarModule,
        InputNumberModule,
        ToolbarModule,
        KeyFilterModule,
        InputTextareaModule,
        TooltipModule,
        StepsModule,
    ]
})
export class ProfessionalModule {
}
