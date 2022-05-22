import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Observable } from 'rxjs/internal/Observable'
import { map } from 'rxjs/operators'
import { ApiService } from 'src/app/services/api.service'
import { CategoriesService } from 'src/app/services/categories.service'
import { DataSourceService } from 'src/app/services/data.source.service'
import { TabsServices } from 'src/app/services/tabs.service'
import { ToastService } from 'src/app/services/toasts.service'

@Component({
    selector: 'app-add-edit-categories',
    templateUrl: './add-edit-categories.component.html',
    styleUrls: ['./add-edit-categories.component.scss'],
})
export class AddEditCategoriesComponent implements OnInit {
    categoryForm: FormGroup

    constructor(
        private _categories: CategoriesService,
        private _router: Router,
        private _fb: FormBuilder,
        private _toast: ToastService,
        private _tabs: TabsServices,
        private _dataSource: DataSourceService,
        private _api: ApiService
    ) {
        this.categoryForm = this._fb.group({
            id: [''],
            categoria: ['', [Validators.required, Validators.minLength(2)]],
        })
    }

    ngOnInit(): void {
        // comprobamos si viene un id, es porque modifica, sino es uno nuevo
        if (this._dataSource.simpleObject?.id)
            this.categoryForm.reset(this._dataSource.simpleObject)

        // limpiamos la data del objeto del servicio
        this._dataSource.simpleObject = {}
    }

    send() {
        this.categoryForm.get('id').value === '' ? this.post() : this.update()
    }

    update() {
        this._toast
            .sweetConfirm('Confirmar cambios', '¿Desea guardar los cambios?')
            .then((res) => {
                if (res)
                    this._categories.update(this.categoryForm.value).subscribe(
                        (res: any) =>
                            this._api.handleSuccess(res, '¡Guardado!', ``),
                        (err) =>
                            this._api.handleError(err, 'Ocurrió un error', ``)
                    )
            })
            .catch((err) => this._api.handleError(err, 'Ocurrió un error', ``))
    }

    post() {
        this._toast
            .sweetConfirm('Guardar', '¿Desea guardar la categoría?')
            .then((res) => {
                if (res)
                    this._categories.post(this.categoryForm.value).subscribe(
                        (res: any) =>
                            this._api.handleSuccess(res, '¡Guardado!', ``),
                        (err) =>
                            this._api.handleError(err, 'Ocurrió un error', ``)
                    )
            })
            .catch((err) => this._api.handleError(err, 'Ocurrió un error', ``))
    }

    goTo() {
        // chequear primero si se edito el producto y avisar antes de redirigir
        this._router
            .navigate(['/productos/tab-categorias'])
            .then(() => this._tabs.setShowTable(true))
    }
}
