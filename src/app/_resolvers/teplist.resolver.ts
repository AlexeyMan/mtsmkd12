// import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
// import {Injectable} from '@angular/core';
// import {Options} from '../_models/mkdlistitem';
// import {Observable} from 'rxjs';
// import {TeplistService} from '../_services/teplist.service';
// import {ListFilter} from '../_models/filters';
// import {DepartmentListEntry} from '../_models/admin';
// import {AuthenticationService} from '../_services';

// @Injectable({ providedIn: 'root' })
// export class TeplistResolver implements Resolve<Options> {

//     constructor(private api: TeplistService) {
//     }

//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<Options> {
//         // return this.api.getTepListOptions();
//         return;
//     }

// }

// @Injectable({ providedIn: 'root' })
// export class TeplistFilterResolver implements Resolve<ListFilter> {

//     constructor(private api: TeplistService) {
//     }

//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<ListFilter> {
//         return this.api.getFilters();
//     }

// }


// @Injectable({ providedIn: 'root' })
// export class TeplistDepartmentResolver implements Resolve<DepartmentListEntry[]> {

//     constructor(private api: TeplistService, private auth: AuthenticationService) {
//     }

//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<DepartmentListEntry[]> {
//         return this.auth.getUserDepartments();
//     }

// }
