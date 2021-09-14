import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JobBoardComponent} from './job-board.component';
import {RoleGuard} from '@shared/guards/role.guard';
import {RolesEnum} from '@shared/enums/roles.enum';

const routes: Routes = [
  {
    path: '',
    component: JobBoardComponent,
    children: [
      {
        path: 'professional',
        loadChildren: () => import('./professional/professional.module').then(m => m.ProfessionalModule),
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
