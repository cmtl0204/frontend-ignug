import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ExampleRoutingModule} from './example-routing.module';
import {ExampleComponent} from './example.component';
import {SharedModule} from '@shared/shared.module';
import {ExampleComponent} from "./example/example.component";
import {ExampleFormComponent} from "./example/example-form/example-form.component";
import {ExampleListComponent} from "./example/example-list/example-list.component";
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


@NgModule({
  declarations: [
    ExampleComponent,
    ExampleComponent,
    ExampleFormComponent,
    ExampleListComponent,
  ],
  imports: [
    CommonModule,
    ExampleRoutingModule,
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
export class ExampleModule {
}
