import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProjectComponent} from './project/project.component';
import {AuthorComponent} from './author/author.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {MainComponent} from './main/main.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'projects',
    component: ProjectComponent
  },
  {
    path: 'authors',
    component: AuthorComponent
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: '/not-found'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
