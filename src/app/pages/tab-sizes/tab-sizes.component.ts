import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { PaginacionService } from 'src/app/components/paginacion/paginacion.service'
import { QueryPaginator } from 'src/app/models/QueryPaginator'
import { Sizes } from 'src/app/models/Sizes.model'
import { SizesService } from 'src/app/services/sizes.service'
import { DataSourceService } from 'src/app/services/data.source.service'
import { TabsServices } from 'src/app/services/tabs.service'

@Component({
    selector: 'app-tab-sizes',
    templateUrl: './tab-sizes.component.html',
    styleUrls: ['./tab-sizes.component.scss'],
})
export class TabSizesComponent implements OnInit {
    showTable$: Observable<boolean>
    sizes: any[] = []
    pag = new QueryPaginator()

    constructor(
        private _sizes: SizesService,
        private _pag: PaginacionService,
        private _dataSource: DataSourceService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _tabs: TabsServices
    ) {
        this.showTable$ = this._tabs.observerShowTable()
        this._tabs.setShowTable(true)
    }

    ngOnInit(): void {}

    pageChanged(event: { pageNro: number; pageSize: number }) {
        this.pag.pageNro = event.pageNro
        this.pag.pageSize = event.pageSize
        this.getAll()
    }

    getAll() {
        this._sizes.getAll().subscribe(
            (res: Sizes[]) => {
                if (!res['ok']) return
                if (!res['data'] || res['data'].length === 0) {
                    this._pag.setBlockBtn(true)
                } else {
                    this._pag.setBlockBtn(false)
                    this.sizes = res['data']
                }
            },
            (err) => console.log(err)
        )
    }

    goTo(product?) {
        this._dataSource.simpleObject = product
        this._router
            .navigate([`add-edit-talles`], {
                relativeTo: this._route,
                skipLocationChange: false,
            })
            .then(() => this._tabs.setShowTable(false))
            .catch((err) => console.error(err))
    }
}
