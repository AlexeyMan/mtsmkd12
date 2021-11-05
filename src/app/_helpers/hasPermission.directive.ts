import { Directive, ElementRef, Input, NgZone, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from '../_services';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective {

  // private roles;
  private permissions:string[] = [];
  private userPermissions:string[] = [];
  // private role;
  private logicalOp = 'AND';
  private isHidden = true;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.authenticationService.userRole.subscribe(roles => {
      this.userPermissions = roles;
      this.updateView();
    });
  }

  @Input()
  set hasPermission(val) {
    this.permissions = val;
    this.updateView();
  }

  @Input()
  set hasPermissionOp(permop) {
    this.logicalOp = permop;
    this.updateView();
  }

  private updateView() {
    if (this.checkPermission()) {
      if (this.isHidden) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isHidden = false;
      }
    } else {
      this.isHidden = true;
      this.viewContainer.clear();
    }
  }

  private checkPermission() {
    let hasPermission:boolean = false;

    if (this.permissions && this.userPermissions) {
      // this.roles.indexOf("ROLE_ADMIN") !== -1
      //   ? (hasPermission = true)
      //   : (hasPermission = this.roles.indexOf(this.role) !== -1);

      if (this.userPermissions.indexOf("ROLE_ADMIN") !== -1) {
        hasPermission = true
      } else {
        for (const checkPermission of this.permissions) {
          // hasPermission = this.permissions.find(x => x.toUpperCase() === checkPermission.toUpperCase());
          const permissionFound = this.userPermissions.find((x:any) => x.toUpperCase() === checkPermission.toUpperCase());
          if (permissionFound) {
            hasPermission = true;

            if (this.logicalOp === 'OR') {
              break;
            }
          } else {
            hasPermission = false;
            if (this.logicalOp === 'AND') {
              break;
            }
          }
        }
      }
    }

    return hasPermission;
  }
}
