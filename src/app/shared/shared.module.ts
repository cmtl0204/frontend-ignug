import {NgModule,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RolesPermissionsDirective} from '@shared/directives/roles-permissions.directive';
import {ErrorMessageDirective} from '@shared/directives/error-message.directive';
import {TokenDirective} from '@shared/directives/token.directive';
import {SkeletonComponent} from '@shared/components/skeleton/skeleton.component';
import {SkeletonModule} from 'primeng/skeleton';
import {TableModule} from 'primeng/table';
import {LabelDirective} from './directives/label.directive';
import {CertificatedPipe} from './pipes/professional/academic-formation/certificated.pipe';
import {WorkedPipe} from './pipes/professional/experience/worked.pipe';
import {ProgressBarComponent} from './components/progress-bar/progress-bar.component';
import {ProgressBarModule} from "primeng/progressbar";

@NgModule({
  declarations: [
    RolesPermissionsDirective,
    ErrorMessageDirective,
    TokenDirective,
    LabelDirective,
    SkeletonComponent,
    ProgressBarComponent,
    CertificatedPipe,
    WorkedPipe],
  exports: [
    RolesPermissionsDirective,
    ErrorMessageDirective,
    TokenDirective,
    LabelDirective,
    SkeletonComponent,
    ProgressBarComponent,
    CertificatedPipe,
    WorkedPipe],
  imports: [
    CommonModule,
    SkeletonModule,
    TableModule,
    ProgressBarModule
  ]
})
export class SharedModule {
}
