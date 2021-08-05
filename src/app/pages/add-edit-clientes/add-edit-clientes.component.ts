import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ClientsService } from 'src/app/services/clients.service';
import { DataSourceService } from 'src/app/services/data.source.service';
import { TabsServices } from 'src/app/services/tabs.service';
import { ToastService } from 'src/app/services/toasts.service';

@Component({
  selector: 'app-add-edit-clientes',
  templateUrl: './add-edit-clientes.component.html',
  styleUrls: ['./add-edit-clientes.component.scss'],
})
export class AddEditClientesComponent implements OnInit {
  @ViewChild('closeModal') private closeModal: ElementRef;
  @Input() canGoBack: boolean = true;
  isEditing: boolean = false;
  enableEdit: boolean = false;
  typeForm: string; // si edita o agrega uno nuevo
  clientForm: FormGroup;

  constructor(
    private _clients: ClientsService,
    private _router: Router,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _tabs: TabsServices,
    private _dataSource: DataSourceService,
    private _api: ApiService
  ) {
    this.clientForm = this._fb.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      apellido: ['', [Validators.required, Validators.maxLength(150)]],
      provincia: ['', [Validators.maxLength(150)]],
      localidad: ['', [Validators.maxLength(150)]],
      avatar: [''],
      telefono: ['', [Validators.maxLength(30)]],
      domicilio: ['', [Validators.maxLength(150)]],
      email: ['', [Validators.maxLength(70)]],
      activo: [true],
    });
  }

  ngOnInit(): void {
    // comprobamos si viene un id, es porque modifica, sino es uno nuevo
    if (this._dataSource.simpleObject?.id)
      this.clientForm.reset(this._dataSource.simpleObject);

    // limpiamos la data del objeto del servicio
    this._dataSource.simpleObject = {};
  }

  public hideModal() {
    this.closeModal.nativeElement.click();
  }

  send() {
    this.clientForm.get('id').value === '' ||
    this.clientForm.get('id').value === null
      ? this.post()
      : this.update();
  }

  update() {
    this._toast
      .sweetConfirm('Confirmar cambios', '¿Desea guardar los cambios?')
      .then((res) => {
        if (res)
          this._clients.update(this.clientForm.value).subscribe(
            (res: any) => {
              this._api.handleSuccess(res, '¡Guardado!', ``);
              this.clean();
            },
            (err) => this._api.handleError(err, 'Ocurrió un error', err.error)
          );
      })
      .catch((err) =>
        this._api.handleError(err, 'Ocurrió un error', err.error)
      );
  }

  post() {
    this._toast
      .sweetConfirm('Guardar', '¿Desea guardar el cliente?')
      .then((res) => {
        if (res)
          this._clients.post(this.clientForm.value).subscribe(
            (res: any) => {
              this._api.handleSuccess(res, '¡Guardado!', ``);
              this.clean();
              this.hideModal();
            },
            (err) => this._api.handleError(err, 'Ocurrió un error', err.error)
          );
      })
      .catch((err) =>
        this._api.handleError(err, 'Ocurrió un error', err.error)
      );
  }

  goTo() {
    this.isEditing
      ? this._toast
          .sweetConfirm(
            'Hay modificaciones sin guardar',
            '¿Descartar modificaciones?'
          )
          .then((res) => (res ? this.redirect() : null))
      : this.redirect();
  }

  redirect() {
    this._router
      .navigate(['/usuarios/tab-clientes'])
      .then(() => this._tabs.setShowTable(true));
  }

  clean() {
    this.clientForm.reset();
  }
}
