import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JobBoardComponent} from './job-board.component';
import {RoleGuard} from '@shared/guards/role.guard';
import {RolesEnum} from '@shared/enums/roles.enum';
import {CategoryComponent} from "./category/category.component";
import {CategoryFormComponent} from "./category/category-form/category-form.component";
import {ExitGuard} from "@shared/guards/exit.guard";

const routes: Routes = [
  {
    path: '',
    component: JobBoardComponent,
    children: [
      {
        path: 'professional',
        loadChildren: () => import('./professional/professional.module').then(m => m.ProfessionalModule),
      },
      {
        path: 'category',
        component: CategoryComponent,
      },
      {
        path: 'category/:id',
        component: CategoryFormComponent,
        canDeactivate: [ExitGuard]
      }
    ],
    // data: {
    //   roles: [RolesEnum.ADMIN, RolesEnum.GUEST]
    // },
    // canActivate: [RoleGuard],
    // canActivateChild: [RoleGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobBoardRoutingModule {
}
