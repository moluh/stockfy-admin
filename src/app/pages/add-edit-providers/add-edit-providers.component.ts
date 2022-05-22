import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ApiService } from 'src/app/services/api.service'
import { DataSourceService } from 'src/app/services/data.source.service'
import { TabsServices } from 'src/app/services/tabs.service'
import { ProvidersService } from 'src/app/services/providers.service'
import { ToastService } from 'src/app/services/toasts.service'

@Component({
    selector: 'app-add-edit-providers',
    templateUrl: './add-edit-providers.component.html',
    styleUrls: ['./add-edit-providers.component.scss'],
})
export class AddEditProvidersComponent implements OnInit {
    providerForm: FormGroup

    constructor(
        private _providers: ProvidersService,
        private _router: Router,
        private _fb: FormBuilder,
        private _toast: ToastService,
        private _tabs: TabsServices,
        private _dataSource: DataSourceService,
        private _api: ApiService
    ) {
        this.providerForm = this._fb.group({
            id: [''],
            proveedor: ['', [Validators.required, Validators.minLength(2)]],
        })
    }

    ngOnInit(): void {
        // comprobamos si viene un id, es porque modifica, sino es uno nuevo
        if (this._dataSource.simpleObject?.id)
            this.providerForm.reset(this._dataSource.simpleObject)

        // limpiamos la data del objeto del servicio
        this._dataSource.simpleObject = {}
    }

    send() {
        this.providerForm.get('id').value === '' ? this.post() : this.update()
    }

    update() {
        this._toast
            .sweetConfirm('Confirmar cambios', '¿Desea guardar los cambios?')
            .then((res) => {
                if (res)
                    this._providers.update(this.providerForm.value).subscribe(
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
            .sweetConfirm('Guardar', '¿Desea guardar el proveedor?')
            .then((res) => {
                if (res)
                    this._providers.post(this.providerForm.value).subscribe(
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
            .navigate(['/productos/tab-proveedores'])
            .then(() => this._tabs.setShowTable(true))
    }
}
