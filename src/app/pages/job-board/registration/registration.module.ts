import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RegistrationRoutingModule} from './registration-routing.module';
import {RegistrationComponent} from './registration.component';
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
import {ProfessionalRegistrationComponent} from "./professional-registration/professional-registration.component";
import {CalendarModule} from "primeng/calendar";
import {InputSwitchModule} from "primeng/inputswitch";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PasswordModule} from "primeng/password";

@NgModule({
  declarations: [
    RegistrationComponent,
    ProfessionalRegistrationComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RegistrationRoutingModule,
    SharedModule,
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
    InputSwitchModule,
    InputTextareaModule,
    PasswordModule
  ]
})
export class RegistrationModule {
}
