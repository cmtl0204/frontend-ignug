import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {JobBoardRoutingModule} from './job-board-routing.module';
import {JobBoardComponent} from './job-board.component';
import {SharedModule} from '@shared/shared.module';


@NgModule({
  declarations: [
    JobBoardComponent
  ],
  imports: [
    CommonModule,
    JobBoardRoutingModule,
    SharedModule
  ]
})
export class JobBoardModule {
}
