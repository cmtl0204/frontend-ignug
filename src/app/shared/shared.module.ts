import {NgModule} from '@angular/core';
import {RolesPermissionsDirective} from './directives/roles-permissions.directive';
import {ErrorMessageDirective} from './directives/error-message.directive';


@NgModule({
  declarations: [RolesPermissionsDirective, ErrorMessageDirective],
  exports: [RolesPermissionsDirective, ErrorMessageDirective],
})
export class SharedModule {
}
