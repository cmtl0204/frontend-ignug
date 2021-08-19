import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {httpInterceptorProviders} from './interceptors';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
// PrimeNg Modules
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import {SidebarModule} from 'primeng/sidebar';
import {RippleModule} from 'primeng/ripple';
import {MenubarModule} from 'primeng/menubar';
import {AvatarModule} from 'primeng/avatar';
import {TableModule} from 'primeng/table';

// Components
import {AppComponent} from './app.component';
import {MainComponent} from './layout/main/main.component';
import {BlankComponent} from './layout/blank/blank.component';
import {SidebarComponent} from './layout/sidebar/sidebar.component';
import {TopbarComponent} from './layout/topbar/topbar.component';
import {FooterComponent} from './layout/footer/footer.component';
import {PanelMenuModule} from 'primeng/panelmenu';
import {RoleGuard} from './shared/guards/role.guard';
import {LocationStrategy, PathLocationStrategy} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    BlankComponent,
    MainComponent,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    AvatarModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    DropdownModule,
    InputSwitchModule,
    InputTextModule,
    TableModule,
    SidebarModule,
    RippleModule,
    MenubarModule,
    PanelMenuModule,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
