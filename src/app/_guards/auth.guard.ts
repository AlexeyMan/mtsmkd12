import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { AuthenticationService } from "../_services";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  private loggedIn = new BehaviorSubject<boolean>(false);

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    if (localStorage.getItem("currentUser")) {
      // logged in so return true
      this.loggedIn.next(true);
      if (next.data.role) {
        this.authService.hasRole(next.data.role).subscribe((result) => {
          if (result === false) {
            this.router.navigate(["/passport"]);
            return false;
          }
          return true;
        });
      }

      return this.loggedIn.asObservable();
    }

    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    this.loggedIn.next(false);
    return this.loggedIn.asObservable();
  }
}
