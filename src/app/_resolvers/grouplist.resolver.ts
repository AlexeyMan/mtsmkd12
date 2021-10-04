import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AdminService} from '../_services/admin.service';
import {Department, Group, UserOptions} from '../_models/admin';
import {HistoryOptions} from '../_models/log';
import {LogService} from '../_services/log.service';

@Injectable({ providedIn: 'root' })
export class DepartmentResolver implements Resolve<Department[]> {

    constructor(private api: AdminService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<Department[]> {
        return this.api.getDepartmentList();
    }

}

@Injectable({ providedIn: 'root' })
export class GrouplistResolver implements Resolve<Group[]> {

    constructor(private api: AdminService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<Group[]> {
        // this.api.listGroups();
        return this.api.getGroupList();
    }

}

@Injectable({ providedIn: 'root' })
export class UserOptionsResolver implements Resolve<UserOptions> {

    constructor(private api: AdminService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<UserOptions> {
        return this.api.getUserOptions();
    }

}


@Injectable({ providedIn: 'root' })
export class HistoryOptionsResolver implements Resolve<HistoryOptions> {

    constructor(private api: LogService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<HistoryOptions> {
        return this.api.getHistoryOptions();
    }

}
