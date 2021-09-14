import {NgModule,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RolesPermissionsDirective} from '@shared/directives/roles-permissions.directive';
import {ErrorMessageDirective} from '@shared/directives/error-message.directive';
import {TokenDirective} from '@shared/directives/token.directive';
import {SkeletonComponent} from '@shared/components/skeleton/skeleton.component';
import {SkeletonModule} from 'primeng/skeleton';
import {TableModule} from 'primeng/table';
import {LabelDirective} from './directives/label.directive';

@NgModule({
  declarations: [TokenDirective, RolesPermissionsDirective, ErrorMessageDirective, SkeletonComponent, LabelDirective,],
  exports: [RolesPermissionsDirective, ErrorMessageDirective, TokenDirective, SkeletonComponent, LabelDirective,],
  imports: [
    CommonModule,
    SkeletonModule,
    TableModule
  ]
})
export class SharedModule {
}
