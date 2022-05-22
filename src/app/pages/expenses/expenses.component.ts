import { Component, Input, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { PaginacionService } from 'src/app/components/paginacion/paginacion.service'
import { Expenses } from 'src/app/models/Expenses.model'
import { QueryPaginator } from 'src/app/models/QueryPaginator'
import { ApiService } from 'src/app/services/api.service'
import { DataSourceService } from 'src/app/services/data.source.service'
import { ExpensesService } from 'src/app/services/expenses.service'
import { TabsServices } from 'src/app/services/tabs.service'
import { ToastService } from 'src/app/services/toasts.service'

@Component({
    selector: 'app-expenses',
    templateUrl: './expenses.component.html',
    styleUrls: ['./expenses.component.scss'],
})
export class ExpensesComponent implements OnInit {
    @Input() blockButtons: boolean = false
    title: string = 'Gastos'
    isActive: boolean = true
    // Search filter input
    searchText: string = ''

    showTable$: Observable<boolean>
    expenses: any[] = []
    pag = new QueryPaginator()

    constructor(
        private _expenses: ExpensesService,
        private _pag: PaginacionService,
        private _dataSource: DataSourceService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _toast: ToastService,
        private _tabs: TabsServices,
        private _api: ApiService
    ) {
        this.showTable$ = this._tabs.observerShowTable()
        this._tabs.setShowTable(true)
    }

    ngOnInit(): void {}

    applyFilter() {
        this.pag.pageNro = 0
    }

    selectExpense(expense) {
        this._dataSource.simpleObject = expense
    }

    delete(exp) {
        this._toast
            .sweetConfirm(
                '¿Eliminar gasto?',
                'Una vez eliminado no se podrá recuperar.'
            )
            .then((res) => {
                if (res)
                    this._expenses.delete(exp.id).subscribe(
                        (res: any) => {
                            if (res.ok) {
                                this._api.handleSuccess(res, '¡Eliminado!', ``)
                                this.expenses = []
                                this.getPaginated()
                            } else {
                                this._api.handleError(
                                    res,
                                    'Ocurrió un error',
                                    res.userMessage
                                )
                            }
                        },
                        (err) =>
                            this._api.handleError(
                                err,
                                'Ocurrió un error',
                                err.error
                            )
                    )
            })
            .catch((err) =>
                this._api.handleError(err, 'Ocurrió un error', err.error)
            )
    }

    pageChanged(event: { pageNro: number; pageSize: number }) {
        this.pag.pageNro = event.pageNro
        this.pag.pageSize = event.pageSize
        this.getPaginated()
    }

    getPaginated() {
        this._expenses
            .getPaginated(this.pag.pageNro, this.pag.pageSize)
            .subscribe(
                (res: Expenses[]) => {
                    if (!res['ok']) return
                    if (!res['data'] || res['data'].length === 0) {
                        this._pag.setBlockBtn(true)
                    } else {
                        this._pag.setBlockBtn(false)
                        this.expenses = res['data']
                    }
                },
                (err) => console.log(err)
            )
    }

    goTo(expense?) {
        if (expense) this._dataSource.simpleObject = expense
        this._router
            .navigate([`add-edit-expenses`], {
                relativeTo: this._route,
                skipLocationChange: false,
            })
            .then(() => this._tabs.setShowTable(false))
            .catch((err) => console.error(err))
    }
}
