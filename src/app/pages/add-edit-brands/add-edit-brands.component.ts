import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ApiService } from 'src/app/services/api.service'
import { BrandsService } from 'src/app/services/brands.service'
import { DataSourceService } from 'src/app/services/data.source.service'
import { TabsServices } from 'src/app/services/tabs.service'
import { ToastService } from 'src/app/services/toasts.service'

@Component({
    selector: 'app-add-edit-brands',
    templateUrl: './add-edit-brands.component.html',
    styleUrls: ['./add-edit-brands.component.scss'],
})
export class AddEditBrandsComponent implements OnInit {
    brandForm: FormGroup

    constructor(
        private _brands: BrandsService,
        private _router: Router,
        private _fb: FormBuilder,
        private _toast: ToastService,
        private _tabs: TabsServices,
        private _dataSource: DataSourceService,
        private _api: ApiService
    ) {
        this.brandForm = this._fb.group({
            id: [''],
            marca: ['', [Validators.required, Validators.minLength(2)]],
        })
    }

    ngOnInit(): void {
        // comprobamos si viene un id, es porque modifica, sino es uno nuevo
        if (this._dataSource.simpleObject?.id)
            this.brandForm.reset(this._dataSource.simpleObject)

        // limpiamos la data del objeto del servicio
        this._dataSource.simpleObject = {}
    }

    send() {
        this.brandForm.get('id').value === '' ? this.post() : this.update()
    }

    update() {
        this._toast
            .sweetConfirm('Confirmar cambios', '¿Desea guardar los cambios?')
            .then((res) => {
                if (res)
                    this._brands.update(this.brandForm.value).subscribe(
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
            .sweetConfirm('Guardar', '¿Desea guardar la marca?')
            .then((res) => {
                if (res)
                    this._brands.post(this.brandForm.value).subscribe(
                        (res: any) =>
                            this._api.handleSuccess(res, '¡Guardado!', ``),
                        (err) =>
                            this._api.handleError(err, 'Ocurrió un error', ``)
                    )
            })
            .catch((err) => this._api.handleError(err, 'Ocurrió un error', ``))
    }

    goTo() {
        this._router
            .navigate(['/productos/tab-marcas'])
            .then(() => this._tabs.setShowTable(true))
    }
}
