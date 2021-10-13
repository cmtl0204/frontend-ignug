import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JobBoardComponent} from './job-board.component';
import {RoleGuard} from '@shared/guards/role.guard';
import {RolesEnum} from '@shared/enums/roles.enum';
import {CategoryComponent} from "./category/category.component";
import {CategoryFormComponent} from "./category/category-form/category-form.component";
import {ExitGuard} from "@shared/guards/exit.guard";
import { AreaFormComponent } from './category/area-form/area-form.component';

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
        path: 'category/area/:id',
        component: AreaFormComponent,
        canDeactivate: [ExitGuard]
      },
      {
        path: 'category/professional-degree',
        component: CategoryComponent,
      },
      {
        path: 'category/professional-degree/:id',
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
