import { Component, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Users } from 'src/app/models/Users.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { map } from 'rxjs/operators';
import { icons } from 'src/assets/icons';
import { TabsServices } from 'src/app/services/tabs.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy, AfterViewInit {

  icons = icons;
  showSide: Subscription;
  showDescrip: boolean = true;
  comSubs: Subscription;
  isLogged$: Observable<boolean>;
  public usuario: Users;
  urlActive: string = "dashboard";
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    event.target.innerWidth < 1600
      ? this.closeNav()
      : this.openNav();
  }

  constructor(
    public auth: AuthService,
    private _showSide: SidebarService,
    private _tabs: TabsServices
  ) {

    this.comSubs = this.auth.getUser().subscribe(
      (user: Users) => {
        if (user == null) return;
        this.usuario = user;
      },
      err => console.log('Error', err));


    this.isLogged$ = this.auth.returnAsObs().pipe(map((val) => { return val }))
  }

  ngOnInit() {
    window.innerWidth < 1600
      ? this.closeNav()
      : this.openNav();
  }

  ngAfterViewInit() {
    this.showSide = this._showSide.observerShowSide().subscribe(
      (show: boolean) => {
        if (show)
          this.openNav();
        else
          this.closeNav();
      }
    )
  }

  ngOnDestroy(): void {
    this.comSubs.unsubscribe();
    this.showSide.unsubscribe();
  }

  openNav() {
    this.showDescrip = true;
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "200px";
  }

  closeNav() {
    this.showDescrip = false;
    document.getElementById("mySidenav").style.width = "40px";
    document.getElementById("main").style.marginLeft = "40px";
  }

  showTable() {
    this._tabs.setShowTable(true)
  }
}
