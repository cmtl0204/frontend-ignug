import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LicenseWorkRoutingModule} from './license-work-routing.module';
import {LicenseWorkComponent} from './license-work.component';
import {SharedModule} from '@shared/shared.module';
import {ToolbarModule} from "primeng/toolbar";
import {CardModule} from "primeng/card";
import {PaginatorModule} from "primeng/paginator";
import {TableModule} from "primeng/table";
import {SplitButtonModule} from "primeng/splitbutton";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {KeyFilterModule} from "primeng/keyfilter";
import {RippleModule} from "primeng/ripple";
import {DividerModule} from "primeng/divider";
import {ProgressBarModule} from "primeng/progressbar";
import {TooltipModule} from "primeng/tooltip";
import {CalendarModule} from "primeng/calendar";
import {InputSwitchModule} from "primeng/inputswitch";
import { ApplicationComponent } from './application/application.component';
import { ApplicationFormComponent } from './Application/application-form/application-form.component';
import { ApplicationListComponent } from './Application/application-list/application-list.component';


@NgModule({
  declarations: [
    ApplicationComponent,
    ApplicationFormComponent,
    ApplicationListComponent,
  ],
  imports: [
    CommonModule,
    LicenseWorkRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    // Modules PrimeNg
    ToolbarModule,
    CardModule,
    PaginatorModule,
    TableModule,
    SplitButtonModule,
    InputTextModule,
    KeyFilterModule,
    RippleModule,
    DividerModule,
    ProgressBarModule,
    TooltipModule,
    CalendarModule,
    InputSwitchModule
  ]
})
export class LicenseWorkModule {
}
