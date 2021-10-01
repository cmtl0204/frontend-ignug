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
import { ExperienceComponent } from './experience/experience.component';
import { ExperienceFormComponent } from './Experience/experience-form/experience-form.component';
import { ExperienceListComponent } from './Experience/experience-list/experience-list.component';
import { LanguageComponent } from './language/language.component';
import { LanguageFormComponent } from './Language/language-form/language-form.component';
import { LanguageListComponent } from './Language/language-list/language-list.component';

@NgModule({
  declarations: [
    ProfessionalComponent,
    ProfileComponent,
    CourseComponent,
    CourseListComponent,
    CourseFormComponent,
    ExperienceComponent,
    ExperienceFormComponent,
    ExperienceListComponent,
    LanguageComponent,
    LanguageFormComponent,
    LanguageListComponent
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
    ]
})
export class ProfessionalModule {
}
