import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExampleComponent} from "./example/example.component";
import {ExampleFormComponent} from "./example/example-form/example-form.component";
import {ExitGuard} from "@shared/guards/exit.guard";

const routes: Routes = [
  {
    path: 'category',
    component: ExampleComponent,
  },
  {
    path: 'example/:id',
    component: ExampleFormComponent,
    canDeactivate: [ExitGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExampleRoutingModule {
}
