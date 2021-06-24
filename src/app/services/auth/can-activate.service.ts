import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastService } from './../toasts.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateService {

  constructor(
    private router: Router,
    private auth: AuthService,
    private _toast: ToastService
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['login']);
      return false;
    } else {
      return true;
    }
  }


}
