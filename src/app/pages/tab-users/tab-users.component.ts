import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PaginacionService } from 'src/app/components/paginacion/paginacion.service';
import { Users } from 'src/app/models/Users.model';
import { DataSourceService } from 'src/app/services/data.source.service';
import { TabsServices } from 'src/app/services/tabs.service';
import { UsersService } from 'src/app/services/users.service';
import { QueryPaginator } from '../../models/QueryPaginator';

const ATTR_LIST = [
  'username',
  'nombre',
  'apellido',
  'localidad',
  'telefono',
  'domicilio',
  'email',
  'roles',
  'activo',
];
const ROLES_LIST = ['ADMIN', 'USUARIO', 'OPERARIO', 'INVITADO'];

@Component({
  selector: 'app-tab-users',
  templateUrl: './tab-users.component.html',
  styleUrls: ['./tab-users.component.scss'],
})
export class TabUsersComponent implements OnInit {
  @Input() isSelectUserAble: boolean;
  // Filters atributes
  attr_selected: string = ATTR_LIST[1];
  attr_list: string[] = ATTR_LIST;
  // Filters roles
  rol_selected: string = ROLES_LIST[0];
  roles_list: string[] = ROLES_LIST;
  // Flag rol active
  isActive: boolean = true;
  // Search filter input
  searchText: string = '';

  showTable$: Observable<boolean>;
  users: any[] = [];
  pag = new QueryPaginator();

  constructor(
    private _users: UsersService,
    private _pag: PaginacionService,
    private _dataSource: DataSourceService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _tabs: TabsServices
  ) {
    this.showTable$ = this._tabs.observerShowTable();
    this._tabs.setShowTable(true);
  }

  ngOnInit(): void {}

  applyFilter() {
    this.pag.pageNro = 0;
    this.pag.attribute = this.attr_selected;
    this.pag.text = this.searchText;
    this.pag.role = this.rol_selected;
    this.pag.isActive = this.isActive;
    this.getPaginatedByTxtAndFilter();
  }

  log() {
    // Filters atributes
    console.log('attr_selected', this.attr_selected);
    // Filters roles
    console.log('rol_selected', this.rol_selected);
    // Flag rol active
    console.log('isActive', this.isActive);
    // Search filter input
    console.log('searchText', this.searchText);
  }

  pageChanged(event: { pageNro: number; pageSize: number }) {
    this.pag.pageNro = event.pageNro;
    this.pag.pageSize = event.pageSize;
    // if (this.searchText === "")
    this.getPaginated();
    // else
    //   this.getPaginatedByTxtAndFilter();
  }

  getPaginated() {
    this._users.getPaginated(this.pag.pageNro, this.pag.pageSize).subscribe(
      (res: Users[]) => {
        if (!res['ok']) return;
        if (!res['data'] || res['data'].length === 0) {
          this._pag.setBlockBtn(true);
        } else {
          this._pag.setBlockBtn(false);
          this.users = res['data'];
        }
      },
      (err) => console.log(err)
    );
  }

  getPaginatedByTxtAndFilter() {
    this._users
      .getPaginatedByTxtAndFilter(
        this.pag.pageNro,
        this.pag.pageSize,
        this.pag.attribute,
        this.pag.text,
        this.pag.role,
        this.pag.isActive
      )
      .subscribe(
        (res: Users[]) => {
          if (!res['ok']) return;
          this.users = [];
          if (!res['data'] || res['data'].length === 0) {
            this._pag.setBlockBtn(true);
          } else {
            this._pag.setBlockBtn(false);
            this.users = res['data'];
          }
        },
        (err) => console.log(err)
      );
  }

  goTo(user?) {
    this._dataSource.simpleObject = user;
    this._router
      .navigate([`add-edit-usuarios`], {
        relativeTo: this._route,
        skipLocationChange: false,
      })
      .then(() => this._tabs.setShowTable(false))
      .catch((err) => console.error(err));
  }

  selectUser(user: Users) {
    this._dataSource.simpleObject = user;
  }
}
