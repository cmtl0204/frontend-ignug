import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {JobBoardRoutingModule} from './job-board-routing.module';
import {JobBoardComponent} from './job-board.component';
import {SharedModule} from '@shared/shared.module';
import {CategoryComponent} from "./category/category.component";
import {CategoryFormComponent} from "./category/category-form/category-form.component";
import {CategoryListComponent} from "./category/category-list/category-list.component";
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


@NgModule({
  declarations: [
    JobBoardComponent,
    CategoryComponent,
    CategoryFormComponent,
    CategoryListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    JobBoardRoutingModule,
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
    ProgressBarModule
  ]
})
export class JobBoardModule {
}
