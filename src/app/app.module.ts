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
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { ReportsComponent } from './components/reports/reports.component';
import { FavoritTabsComponent } from './components/favorit-tabs/favorit-tabs.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TepTableComponent,
    HeaderComponent,
    FiltersComponent,
    ReportsComponent,
    FavoritTabsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    SelectAutocompleteModule,
  ],
  providers: [
    AuthGuard,
    { provide: LOCALE_ID, useValue: "ru-Ru" }, // replace "en-US" with your locale
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  exports: [ FiltersComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
