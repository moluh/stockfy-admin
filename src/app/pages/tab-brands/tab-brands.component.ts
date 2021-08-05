import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PaginacionService } from 'src/app/components/paginacion/paginacion.service';
import { Brands } from 'src/app/models/Brands.model';
import { QueryPaginator } from 'src/app/models/QueryPaginator';
import { BrandsService } from 'src/app/services/brands.service';
import { DataSourceService } from 'src/app/services/data.source.service';
import { TabsServices } from "src/app/services/tabs.service";
import { icons } from 'src/assets/icons';

@Component({
  selector: 'app-tab-brands',
  templateUrl: './tab-brands.component.html',
  styleUrls: ['./tab-brands.component.scss']
})
export class TabBrandsComponent implements OnInit {

  showTable$: Observable<boolean>;
  brands: any[] = [];
  pag = new QueryPaginator();

  constructor(
    private _brands: BrandsService,
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
    this._brands.getPaginated(this.pag.pageNro, this.pag.pageSize).subscribe(
      (res: Brands[]) => {
        if (!res['ok']) return;
        if (!res['data'] || res['data'].length === 0) {
          this._pag.setBlockBtn(true);
        } else {
          this._pag.setBlockBtn(false);
          this.brands = res['data'];
        }
      },
      (err) => console.log(err));
  }

  goTo(product?) {
    this._dataSource.simpleObject = product;
    this._router.navigate([`add-edit-marcas`], { relativeTo: this._route, skipLocationChange: false })
      .then(() => this._tabs.setShowTable(false))
      .catch(err => console.error(err));
  }
}
