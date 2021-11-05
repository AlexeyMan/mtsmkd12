import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { LoginComponent } from "./components/login";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from "./_guards";
import {
  ErrorInterceptor,
  JwtInterceptor,
} from './_helpers';
import { HeaderComponent } from "./components/header/header.component";
import { TepTableComponent } from "./components/tep-table/tep-table.component";
// material
import { MaterialModule } from "./material-module";
import { FiltersComponent } from './components/filters/filters.component';
import { ReportsComponent } from './components/reports/reports.component';
import { FavoritTabsComponent } from './components/favorit-tabs/favorit-tabs.component';
import {MatPaginatorIntl} from "@angular/material/paginator";
import { getRussianPaginatorIntl } from "./_helpers/russian-paginator";
import { NgSelectModule } from '@ng-select/ng-select';
import { DeleteDialogComponent } from "./components/dialog/delete-tep-dialog/delete-tep-dialog.component";
// import { PassportModule } from './passport-module';
import { MkdComponent } from './components/passport/mkd/mkd.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { HasPermissionDirective } from './_helpers/hasPermission.directive';
import { TopmenuComponent } from "./components/topmenu/topmenu.component";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { FieldsetComponent } from "./components/passport/fieldset/fieldset.component";
// import { RouterModule } from "@angular/router";
import { CommoninformationComponent } from "./components/passport/commoninformation/commoninformation.component";
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TepTableComponent,
    HeaderComponent,
    FiltersComponent,
    ReportsComponent,
    FavoritTabsComponent,
    DeleteDialogComponent,
    MkdComponent,
    HasPermissionDirective,
    TopmenuComponent,
    FieldsetComponent,
    CommoninformationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgSelectModule,
    NgImageSliderModule,
  ],
  entryComponents: [
    DeleteDialogComponent,
  ],
  providers: [
    AuthGuard,
    { provide: LOCALE_ID, useValue: "ru-Ru" }, // replace "en-US" with your locale
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MatPaginatorIntl, useValue: getRussianPaginatorIntl() },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
  ],
  exports: [
    // RouterModule,
    FiltersComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
