import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProfessionalRegistrationComponent} from "./professional-registration/professional-registration.component";
import {RegistrationComponent} from "./registration.component";

const routes: Routes = [
  {
    path: '',
    component: RegistrationComponent,
    children: [
      {
        path: 'professional',
        component: ProfessionalRegistrationComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule {
}
