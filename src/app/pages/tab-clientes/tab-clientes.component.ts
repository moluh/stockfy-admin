import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PaginacionService } from 'src/app/components/paginacion/paginacion.service';
import { QueryPaginator } from 'src/app/models/QueryPaginator';
import { Users } from 'src/app/models/Users.model';
import { ClientsService } from 'src/app/services/clients.service';
import { DataSourceService } from 'src/app/services/data.source.service';
import { TabsServices } from 'src/app/services/tabs.service';
import { ToastService } from 'src/app/services/toasts.service';
import { icons } from 'src/assets/icons';

const ATTR_LIST = [
  'nombre',
  'apellido',
  'localidad',
  'telefono',
  'domicilio',
  'email',
  'activo',
];

@Component({
  selector: 'app-tab-clientes',
  templateUrl: './tab-clientes.component.html',
  styleUrls: ['./tab-clientes.component.scss'],
})
export class TabClientesComponent implements OnInit {
  
  @Input() blockButtons: boolean = false;
  // Filters atributes
  attr_selected: string = ATTR_LIST[0];
  attr_list: string[] = ATTR_LIST;
  // Flag rol active
  isActive: boolean = true;
  // Search filter input
  searchText: string = '';
  isFiltering: boolean = false;

  showTable$: Observable<boolean>;
  clients: any[] = [];
  pag = new QueryPaginator();

  constructor(
    private _clients: ClientsService,
    private _pag: PaginacionService,
    private _dataSource: DataSourceService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _tabs: TabsServices,
    private _toast: ToastService
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
    this.getPaginatedByTxtAndFilter();
  }

  reset(event?: any) {
    this._pag.setPag(0);
    this.isFiltering ? this.getPaginatedByTxtAndFilter() : this.getPaginated();
  }

  selectClient(client) {
    this._dataSource.simpleObject = client;
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
    this._clients.getPaginated(this.pag.pageNro, this.pag.pageSize).subscribe(
      (res: Users[]) => this.setData(res),
      (err) => console.log(err)
    );
  }

  getPaginatedByTxtAndFilter() {
    this._clients
      .getPaginatedByTxtAndFilter(
        this.pag.pageNro,
        this.pag.pageSize,
        this.pag.attribute,
        this.pag.text,
        this.pag.isActive
      )
      .subscribe(
        (res: Users[]) => this.setData(res),
        (err) => console.log(err)
      );
  }

  setData(res) {
    this.clients = [];
    this.clients = res.data;
    if (!res.ok) return this._toast.toastError('Intente nuevamente', 'Error');
    else if (res.data.length === 0) {
      this._pag.setBlockBtn(true);
      return this._toast.toastAlert('No se encontraron clientes', '');
    } else return this._pag.setBlockBtn(false);
  }

  goTo(client?) {
    this._dataSource.simpleObject = client;
    this._router
      .navigate([`add-edit-clientes`], {
        relativeTo: this._route,
        skipLocationChange: false,
      })
      .then(() => this._tabs.setShowTable(false))
      .catch((err) => console.error(err));
  }
}
