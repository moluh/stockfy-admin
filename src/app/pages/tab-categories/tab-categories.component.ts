import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginacionService } from 'src/app/components/paginacion/paginacion.service';
import { Categories } from 'src/app/models/Categories.model';
import { QueryPaginator } from 'src/app/models/QueryPaginator';
import { CategoriesService } from 'src/app/services/categories.service';
import { DataSourceService } from 'src/app/services/data.source.service';
import { TabsServices } from "src/app/services/tabs.service";

@Component({
  selector: 'app-tab-categories',
  templateUrl: './tab-categories.component.html',
  styleUrls: ['./tab-categories.component.scss']
})
export class TabCategoriesComponent implements OnInit {

  showTable$: Observable<boolean>;
  categories: any[] = [];
  pag = new QueryPaginator();

  constructor(
    private _categories: CategoriesService,
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
    this._categories.getPaginated(this.pag.pageNro, this.pag.pageSize).subscribe(
      (res: Categories[]) => {
        if (!res['ok']) return;
        if (!res['data'] || res['data'].length === 0) {
          this._pag.setBlockBtn(true);
        } else {
          this._pag.setBlockBtn(false);
          this.categories = res['data'];
        }
      },
      (err) => console.log(err));
  }

  goTo(product?) {
    this._dataSource.simpleObject = product;
    this._router.navigate([`add-edit-categorias`], { relativeTo: this._route, skipLocationChange: false })
      .then(() => this._tabs.setShowTable(false))
      .catch(err => console.error(err));
  }

}
