import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PaginacionService } from 'src/app/components/paginacion/paginacion.service';
import { Providers } from 'src/app/models/Providers.model';
import { QueryPaginator } from 'src/app/models/QueryPaginator';
import { DataSourceService } from 'src/app/services/data.source.service';
import { TabsServices } from "src/app/services/tabs.service";
import { ProvidersService } from 'src/app/services/providers.service';

@Component({
  selector: 'app-tab-providers',
  templateUrl: './tab-providers.component.html',
  styleUrls: ['./tab-providers.component.scss']
})
export class TabProvidersComponent implements OnInit {

  showTable$: Observable<boolean>;
  providers: any[] = [];
  pag = new QueryPaginator();

  constructor(
    private _providers: ProvidersService,
    private _pag: PaginacionService,
    private _dataSource: DataSourceService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _tabs: TabsServices,
  ) {

    this.showTable$ = this._tabs.observerShowTable();
    this._tabs.setShowTable(true);

  }

  ngOnInit(): void {

  }

  pageChanged(event: { pageNro: number; pageSize: number; }) {
    this.pag.pageNro = event.pageNro;
    this.pag.pageSize = event.pageSize;
    this.getPaginated();
  }

  getPaginated() {
    this._providers.getPaginated(this.pag.pageNro, this.pag.pageSize).subscribe(
      (res: Providers[]) => {
        if (!res['ok']) return;
        if (!res['data'] || res['data'].length === 0) {
          this._pag.setBlockBtn(true);
        } else {
          this._pag.setBlockBtn(false);
          this.providers = res['data'];
        }
      },
      (err) => console.log(err));
  }

  goTo(product?) {
    this._dataSource.simpleObject = product;
    this._router.navigate([`add-edit-proveedores`], { relativeTo: this._route, skipLocationChange: false })
      .then(() => this._tabs.setShowTable(false))
      .catch(err => console.error(err));
  }
}
