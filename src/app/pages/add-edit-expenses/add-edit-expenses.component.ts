import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ApiService } from 'src/app/services/api.service'
import { DataSourceService } from 'src/app/services/data.source.service'
import { DatesService } from 'src/app/services/dates.service'
import { ExpensesService } from 'src/app/services/expenses.service'
import { TabsServices } from 'src/app/services/tabs.service'
import { ToastService } from 'src/app/services/toasts.service'

@Component({
    selector: 'app-add-edit-expenses',
    templateUrl: './add-edit-expenses.component.html',
    styleUrls: ['./add-edit-expenses.component.scss'],
})
export class AddEditExpensesComponent implements OnInit {
    isEditing: boolean = false
    enableEdit: boolean = false
    typeForm: string // si edita o agrega uno nuevo
    expenseForm: FormGroup

    constructor(
        private _expenses: ExpensesService,
        private _router: Router,
        private _fb: FormBuilder,
        private _toast: ToastService,
        private _tabs: TabsServices,
        private _dataSource: DataSourceService,
        private _date: DatesService,
        private _api: ApiService
    ) {
        this.expenseForm = this._fb.group({
            id: [''],
            monto: ['', [Validators.required, Validators.minLength(1)]],
            descripcion: ['', [Validators.required, Validators.minLength(2)]],
            fecha: [this._date.getActualDate()],
        })
    }

    ngOnInit(): void {
        // comprobamos si viene un id, es porque modifica, sino es uno nuevo
        if (this._dataSource.simpleObject?.id)
            this.expenseForm.reset(this._dataSource.simpleObject)

        // limpiamos la data del objeto del servicio
        this._dataSource.simpleObject = {}
    }

    send() {
        this.expenseForm.get('id').value === '' ||
        this.expenseForm.get('id').value === null
            ? this.post()
            : this.update()
    }

    update() {
        this._toast
            .sweetConfirm('Confirmar cambios', '¿Desea guardar los cambios?')
            .then((res) => {
                if (res)
                    this._expenses.update(this.expenseForm.value).subscribe(
                        (res: any) => {
                            this._api.handleSuccess(res, '¡Guardado!', ``)
                            this.clean()
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

    post() {
        this._toast
            .sweetConfirm('Guardar', '¿Desea guardar el gasto?')
            .then((res) => {
                if (res)
                    this._expenses.post(this.expenseForm.value).subscribe(
                        (res: any) => {
                            this._api.handleSuccess(res, '¡Guardado!', ``)
                            this.clean()
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

    goTo() {
        this.isEditing
            ? this._toast
                  .sweetConfirm(
                      'Hay modificaciones sin guardar',
                      '¿Descartar modificaciones?'
                  )
                  .then((res) => (res ? this.redirect() : null))
            : this.redirect()
    }

    redirect() {
        this._router
            .navigate(['/gastos'])
            .then(() => this._tabs.setShowTable(true))
    }

    clean() {
        this.expenseForm.reset()
    }
}
