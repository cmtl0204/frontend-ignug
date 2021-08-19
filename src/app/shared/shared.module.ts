import {NgModule} from '@angular/core';
import {RolesPermissionsDirective} from './directives/roles-permissions.directive';
import {ErrorMessageDirective} from './directives/error-message.directive';
import {TokenDirective} from '@shared/directives/token.directive';


@NgModule({
  declarations: [TokenDirective,RolesPermissionsDirective, ErrorMessageDirective],
  exports: [RolesPermissionsDirective, ErrorMessageDirective, TokenDirective],
})
export class SharedModule {
}
