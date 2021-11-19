import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

const TABS = [
  { id: "usuarios", name: "Usuarios" }
]

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  title: string = "Usuarios";
  tabName: string = "";
  tabList: any[] = TABS;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.setTabaName();
  }

  setTabaName(value?: string) {
    // si viene un valor(hace click en una tab) o no..
    value
      ? this.tabName = value
      : this.tabName = "Usuarios";

    const tab = this.tabList.find(tab => tab.name === this.tabName).id;
    this._router.navigate([`/usuarios/tab-${tab}`], { relativeTo: this._route, skipLocationChange: false })
  }


}
