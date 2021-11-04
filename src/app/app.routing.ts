import { templateSourceUrl } from '@angular/compiler';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login';
import { AppComponent } from './app.component';
import { AuthGuard } from "./_guards";
import { TepTableComponent } from "./components/tep-table/tep-table.component";
import { MkdComponent } from './components/passport/mkd';
import { MkdMenuResolver, TepIdResolver, TepSectionResolver } from './_resolvers/mkd.resolver';
// import {
//   TeplistDepartmentResolver,
//   TeplistFilterResolver,
//   TeplistResolver,
// } from "./_resolvers/teplist.resolver";

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  {
    path: "passport",
    component: TepTableComponent,
    // resolve: {
      // options: TeplistResolver,
      // filters: TeplistFilterResolver,
      // alldepartments: TeplistDepartmentResolver,
    // },
    canActivate: [AuthGuard],
  },
  {
    path: "mkd/:id/:alias",
    component: MkdComponent,
    resolve: {
      tepMenu: MkdMenuResolver,
      houseid: TepIdResolver,
      alias: TepSectionResolver,
    },
    canActivate: [AuthGuard],
    data: {
      role: "ROLE_VIEW_TEP",
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
