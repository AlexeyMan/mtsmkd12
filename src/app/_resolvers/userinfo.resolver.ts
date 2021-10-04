import {CommonService} from '../_services/common.service';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {UserInfo} from '../_models/common';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserInfoResolver implements Resolve<UserInfo> {

    constructor(private common: CommonService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserInfo> {
        return this.common.getCommonUserInfo();
    }
}
