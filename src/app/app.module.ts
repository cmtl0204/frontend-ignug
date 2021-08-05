import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

// PrimeNg Modules
import {ButtonModule} from 'primeng/button';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';

// Components
import {ProjectComponent} from './project/project.component';
import {AuthorComponent} from './author/author.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {MainComponent} from './main/main.component';
import {AccessDeniedComponent} from './access-denied/access-denied.component';
import {UnderMaintenanceComponent} from './under-maintenance/under-maintenance.component';
import {KeyValuePipe} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    ProjectComponent,
    AuthorComponent,
    NotFoundComponent,
    MainComponent,
    AccessDeniedComponent,
    UnderMaintenanceComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ButtonModule,
    CardModule,
    InputSwitchModule,
    InputTextModule,
  ],
  providers: [KeyValuePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
