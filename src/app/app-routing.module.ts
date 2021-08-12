import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './layout/main/main.component';
import {BlankComponent} from './layout/blank/blank.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'user-administration',
        loadChildren: () => import('./pages/user-administration/user-administration.module').then(m => m.UserAdministrationModule)
      }
    ]
  },
  {
    path: 'authentication',
    component: BlankComponent,
    loadChildren: () => import('./pages/authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'common',
    component: BlankComponent,
    loadChildren: () => import('./pages/common/common.module').then(m => m.CommonModule)
  },
  {
    path: '**',
    redirectTo: 'common/not-found'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
