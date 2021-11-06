import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SidebarService } from 'src/app/services/sidebar.service';
import { Users } from 'src/app/models/Users.model';
import { icons } from 'src/assets/icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  icons = icons;
  side: boolean = true;
  ulMobile: boolean = false;
  comSubs: Subscription;
  isLogged$: Observable<boolean>;
  usuario: Users;

  constructor(public auth: AuthService, public _side: SidebarService) {
    this.comSubs = this.auth.getUser().subscribe({
      next: (user: Users) => {
        console.log('user',user);
        
        if (user === null) 
          return
        
        this.usuario = user;
      },
      error: () => {},
    });

    this._side.setShowSide(true);
  }

  setUlMobile() {
    this.ulMobile = !this.ulMobile;
  }

  ngOnInit() {
    this.isLogged$ = this.auth.returnAsObs().pipe(
      map((val) => {
        return val;
      })
    );
  }

  setSide() {
    this.side ? this._side.setShowSide(false) : this._side.setShowSide(true);
    this.side = !this.side;
  }

  ngOnDestroy(): void {
    this.comSubs.unsubscribe();
  }
}
