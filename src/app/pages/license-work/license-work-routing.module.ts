import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExampleComponent} from "./example/example.component";
import {ExampleFormComponent} from "./example/example-form/example-form.component";
import {ExitGuard} from "@shared/guards/exit.guard";
import {ApplicationComponent} from "./application/application.component";
import {ApplicationFormComponent} from "./application/application-form/application-form.component";

const routes: Routes = [
  {
    path: 'category',
    component: ExampleComponent,
  },
  {
    path: 'example/:id',
    component: ExampleFormComponent,
    canDeactivate: [ExitGuard]
  },
  {
    path: 'application',
    component: ApplicationComponent,
  },
  {
    path: 'application/:id',
    component: ApplicationFormComponent,
    canDeactivate: [ExitGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicenseWorkRoutingModule {
}
