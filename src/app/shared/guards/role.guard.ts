import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {PermissionModel, RoleModel} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {
  private roles: RoleModel[] = [];

  constructor(private authService: AuthService, private router: Router) {
    this.roles = authService.roles;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkRole(route);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }

  private checkRole(route: ActivatedRouteSnapshot): boolean {
    const splitRoles = route.data.roles.split('|');

    for (const splitRole of splitRoles) {
      if (this.roles.find(role => role.name?.toLowerCase() === splitRole.toLowerCase())) {
        return true;
      }
    }

    // this.router.navigate(['/common/access-denied']);
    console.log('sin rol');
    return false;
  }

}
