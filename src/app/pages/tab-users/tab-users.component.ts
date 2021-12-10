import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PaginacionService } from 'src/app/components/paginacion/paginacion.service';
import { Users } from 'src/app/models/Users.model';
import { ApiService } from 'src/app/services/api.service';
import { DataSourceService } from 'src/app/services/data.source.service';
import { TabsServices } from 'src/app/services/tabs.service';
import { ToastService } from 'src/app/services/toasts.service';
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
const ROLES_LIST = [
  'SUPERADMIN',
  'ADMIN',
  'SUPERVISOR',
  'EMPLEADO',
  'EXTERNO',
  'USUARIO',
  'INVITADO',
  'TESTER',
];

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

  isFiltering: boolean = false;

  constructor(
    private _users: UsersService,
    private _pag: PaginacionService,
    private _dataSource: DataSourceService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _tabs: TabsServices,
    private _api: ApiService
  ) {
    this.showTable$ = this._tabs.observerShowTable();
    this._tabs.setShowTable(true);
  }

  ngOnInit(): void {}

  removeFilter() {
    this.isFiltering = false;
    this.reset();
  }

  applyFilter() {
    // this._pag.setPag(0);
    this.isFiltering = true;
    this.pag.pageNro = 0;
    this.pag.attribute = this.attr_selected;
    this.pag.text = this.searchText;
    this.pag.isActive = this.isActive;
    this.pag.role = this.rol_selected;
    this.getPaginatedByTxtAndFilter();
  }

  reset(event?: any) {
    this._pag.setPag(0);
    this.isFiltering ? this.getPaginatedByTxtAndFilter() : this.getPaginated();
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
    this._users.getPaginated(this.pag.pageNro, this.pag.pageSize).subscribe({
      next: (res: Users[]) => this.setData(res),
      error: (err) => console.log(err),
    });
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
      .subscribe({
        next: (res: Users[]) => this.setData(res),
        error: (err) => console.log(err),
      });
  }

  setData(res) {
    this.users = [];
    this.users = res.data;
    if (!res.ok) return this._api.handleError(res, '', '');
    else if (res.data.length === 0) {
      this._pag.setBlockBtn(true);
      return this._api.handleAlert(res, 'No se encontraron clientes', '');
    } else {
      return this._pag.setBlockBtn(false);
    }
  }

  // next: (resp: any) => {
  //   this._api.handleSuccess(resp, '¡Guardado!', ``);
  //   this.hideModal();
  // },
  // error: (err) => this._api.handleError(err, 'Ocurrió un error', ``),

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
