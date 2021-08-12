import { NgModule } from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import {CommonRoutingModule} from './common-routing.module';

@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    NgCommonModule,
    CommonRoutingModule
  ]
})
export class CommonModule { }
