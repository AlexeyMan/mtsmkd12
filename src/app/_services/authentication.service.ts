import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { catchError, map } from "rxjs/operators";
import { AppSettings } from "../appSettings";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { ConsoleLoggerService } from "./console-logger.service";
// import { DepartmentListEntry, UserDetail } from "../_models/admin";
import { UserDetail } from "../_models/admin";
import { SettingsService } from "./settings.service";
import { LocalStorageService } from "./store";
@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private _loggedIn = new BehaviorSubject<boolean>(false);
  private _userRole = new BehaviorSubject<any>("");
  private _userName = new BehaviorSubject<string>("");
  private _userId = new BehaviorSubject<string>("");
  private _userFullName = new BehaviorSubject<string>("");

  get isLoggedIn() {
    this._loggedIn.next(localStorage.getItem("currentUser") !== null);
    return this._loggedIn.asObservable(); // {2}
  }

  // get userRole() {
  //   try {
  //     this._userRole.next(localStorage.getItem("userRole").split(","));
  //     return this._userRole.asObservable();
  //   } catch (e) {
  //     this._userRole.next([]);
  //     return this._userRole.asObservable();
  //   }
  // }

  // get userFullName() {
  //   this._userFullName.next(localStorage.getItem("userFullName"));
  //   return this._userFullName.asObservable();
  // }

  // get userName() {
  //   this._userName.next(localStorage.getItem("username"));
  //   return this._userName.asObservable();
  // }

  // get userId() {
  //   this._userId.next(localStorage.getItem("userid"));
  //   return this._userId.asObservable();
  // }

  constructor(
    private http: HttpClient,
    private router: Router,
    private log: ConsoleLoggerService,
    private settings: SettingsService,
    private apiStore: LocalStorageService,
  ) {}

  login(username: string, password: string) {
    return this.http
      .post<any>(AppSettings.API_ENDPOINT + "login_check", {
        _username: username,
        _password: password,
      })
      .pipe(
        map(
          (res: any) => {
          // login successful if there's a jwt token in the response
          this._userName.next(username);
          localStorage.setItem(
            "currentUser",
            JSON.stringify({ username, token: res.token })
          );
          localStorage.setItem("username", username);
          this._loggedIn.next(true);

          if (res && res.token) {
            // this.log.info("were started!");
            this.getUser().subscribe((p:any) => {
              localStorage.setItem("userid", String(p["id"]));
              localStorage.setItem("userFullName", String(p["user_full_name"]));
              // p.settings.filters.columns = [0,"favorite",1,"house_id",2,"district_name",3,"address",4,"category_name",5,"total_damage"]
              this.apiStore.setStore("userFilters", p.settings.filters);
              // this._loggedIn.next(true);
              this.router.navigate(["/passport"]);
              this.log.info("were started!");
            });
          } else {
            console.log("unable to login");
          }
        })
      );
  }

  // getUserByName(user_name): Observable<UserDetail[]> {
  //   return this.http
  //     .get<UserDetail[]>(
  //       AppSettings.API_ENDPOINT + "admin/users?user_name=" + user_name
  //     )
  //     .pipe(
  //       map((res: any) => {
  //         console.log(res);
  //         console.log(user_name);
  //         // return res["data"].filter(
  //         //   (message) => message.username === user_name
  //         // );
  //         return res;
  //       }),
  //       catchError((error) => {
  //         return throwError(
  //           "Something went wrong with user detail by name " + error
  //         );
  //       })
  //     );
  // }

  getUsers(): Observable<UserDetail[]> {
    return this.http
      .get<UserDetail[]>(AppSettings.API_ENDPOINT + "admin/users")
      .pipe(
        map((res) => {
          const data = res;
          console.log(res);
          const udetail: UserDetail = <UserDetail>{};
          udetail.email = "";
          udetail.id = -1;
          udetail.user_full_name = "Общая рассылка";
          udetail.username = "Общая рассылка";
          data.unshift(udetail);
          return res;
        }),
        catchError((error) => {
          return throwError(
            "Something went wrong with getting users: " + error
          );
        })
      );
  }

  getUser(): Observable<any[]> {
    return this.http
      .get<any[]>(AppSettings.API_ENDPOINT + "common/user-info")
      .pipe(
        map((res:any) => {
          this._userRole.next(res["roles"]);
          localStorage.setItem("userRole", String(res["roles"]));
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: user departments!");
        })
      );
  }

  // getUserDepartments(): Observable<DepartmentListEntry[]> {
  //   return this.http
  //     .get<DepartmentListEntry[]>(AppSettings.API_ENDPOINT + "common/user-info")
  //     .pipe(
  //       map((res) => {
  //         this._userFullName.next(res["user_full_name"]);
  //         return res["departments"];
  //       }),
  //       catchError((error) => {
  //         return throwError("Something went wrong: user departments!");
  //       })
  //     );
  // }

  logout() {
    localStorage.removeItem("mainPageTableData");
    localStorage.removeItem("mainPageTotal");
    localStorage.removeItem("mainPageFilters");
    localStorage.removeItem("mainPageUserFilters");
    localStorage.removeItem("userFilters");
    // remove user from local storage to log user out
    this._userName.next("");
    this._userFullName.next("");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("username");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userid");
    localStorage.removeItem("userRole");
    this.settings.setEditMode(false);
    this._loggedIn.next(false);
    this._userRole.next("");

    this.router.navigate(["/login"]);
  }

  norigths() {
    this.router.navigate(["/error403"]);
  }

  someerror() {
    this.router.navigate(["/error500"]);
  }

  hasRole(role:any): Observable<boolean> {
    let isEnabledRole = false;
    this._userRole.subscribe((roles:any) => {
      roles.indexOf("ROLE_ADMIN") !== -1
        ? (isEnabledRole = true)
        : (isEnabledRole = roles.indexOf(role) !== -1);
    });
    return of(isEnabledRole);
  }
}
