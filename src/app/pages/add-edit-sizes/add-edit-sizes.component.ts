import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SizesService } from 'src/app/services/sizes.service';
import { DataSourceService } from 'src/app/services/data.source.service';
import { TabsServices } from 'src/app/services/tabs.service';
import { ToastService } from 'src/app/services/toasts.service';

@Component({
  selector: 'app-add-edit-sizes',
  templateUrl: './add-edit-sizes.component.html',
  styleUrls: ['./add-edit-sizes.component.scss']
})
export class AddEditSizesComponent implements OnInit {

  sizeForm: FormGroup;

  constructor(
    private _sizes: SizesService,
    private _router: Router,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _tabs: TabsServices,
    private _dataSource: DataSourceService,
    private _api: ApiService) {

    this.sizeForm = this._fb.group({
      id: [''],
      talle: ['', [Validators.required, Validators.minLength(1)]],
    });

  }

  ngOnInit(): void {
    // comprobamos si viene un id, es porque modifica, sino es uno nuevo
    if (this._dataSource.simpleObject?.id)
      this.sizeForm.reset(this._dataSource.simpleObject);

    // limpiamos la data del objeto del servicio
    this._dataSource.simpleObject = {};
  }

  send() {
    this.sizeForm.get('id').value === ''
      ? this.post()
      : this.update();
  }

  update() {
    this._toast.sweetConfirm('Confirmar cambios', '¿Desea guardar los cambios?')
      .then((res) => {

        if (res)
          this._sizes.update(this.sizeForm.value).subscribe(
            (res: any) => this._api.handleSuccess(res, '¡Guardado!', ``),
            err => this._api.handleError(err, 'Ocurrió un error', ``));

      })
      .catch(err => this._api.handleError(err, 'Ocurrió un error', ``))
  }

  post() {
    this._toast.sweetConfirm('Guardar', '¿Desea guardar la talle?')
      .then(res => {
        
        if (res)
          this._sizes.post(this.sizeForm.value).subscribe(
            (res: any) => this._api.handleSuccess(res, '¡Guardado!', ``),
            err => this._api.handleError(err, 'Ocurrió un error', ``));

      })
      .catch(err => this._api.handleError(err, 'Ocurrió un error', ``))
  }

  goTo() {
    this._router.navigate(["/productos/tab-talles"])
      .then(() => this._tabs.setShowTable(true))
  }
}
