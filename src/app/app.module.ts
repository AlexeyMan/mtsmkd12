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
// import { HeaderComponent } from "./components/header/header.component";

import { MatIconModule } from "@angular/material/icon";
import { TepTableComponent } from "./components/tep-table/tep-table.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TepTableComponent
    // HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
  ],
  providers: [
    AuthGuard,
    { provide: LOCALE_ID, useValue: "ru-Ru" }, // replace "en-US" with your locale
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
