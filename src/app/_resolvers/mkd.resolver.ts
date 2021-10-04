import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {TeplistService} from '../_services/teplist.service';
import {TepField} from '../_models/tep';
import {TepMenuItem} from '../_models/tepmenu';


@Injectable({ providedIn: 'root' })
export class MkdCommonInformationResolver implements Resolve<TepField[]> {

    constructor(private mkdService: TeplistService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TepField[]> {
        return this.mkdService.getCommonParametersById(route.params['id']);
    }
}


@Injectable({ providedIn: 'root' })
export class MkdMenuResolver implements Resolve<TepMenuItem[]> {

    constructor(private mkdService: TeplistService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TepMenuItem[]> {
        return this.mkdService.getTepMenu();
    }
}

@Injectable({ providedIn: 'root' })
export class TepSectionResolver implements Resolve<string> {

    constructor() {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
        return route.params['alias'];
    }
}

@Injectable({ providedIn: 'root' })
export class TepIdResolver implements Resolve<string> {

    constructor() {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
        return route.params['id'];
    }
}
