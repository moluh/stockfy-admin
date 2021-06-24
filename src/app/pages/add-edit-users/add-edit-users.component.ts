import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DataSourceService } from 'src/app/services/data.source.service';
import { TabsServices } from 'src/app/services/tabs.service';
import { ToastService } from 'src/app/services/toasts.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-add-edit-users',
  templateUrl: './add-edit-users.component.html',
  styleUrls: ['./add-edit-users.component.scss'],
})
export class AddEditUsersComponent implements OnInit {
  userForm: FormGroup;
  isEditing: boolean = false;

  constructor(
    private _users: UsersService,
    private _router: Router,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _tabs: TabsServices,
    private _dataSource: DataSourceService,
    private _api: ApiService
  ) {
    this.userForm = this._fb.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.minLength(2)]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // comprobamos si viene un id, es porque modifica, sino es uno nuevo
    if (this._dataSource.simpleObject?.id)
      this.userForm.reset(this._dataSource.simpleObject);

    // limpiamos la data del objeto del servicio
    this._dataSource.simpleObject = {};
  }

  send() {
    this.userForm.get('id').value === '' ? this.post() : this.update();
  }

  compareRol(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2 : c1 === c2;
  }

  update() {
    this._toast
      .sweetConfirm('Confirmar cambios', '¿Desea guardar los cambios?')
      .then((res) => {
        if (res)
          this._users.update(this.userForm.value).subscribe(
            (res: any) => this._api.handleSuccess(res, '¡Guardado!', ``),
            (err) => this._api.handleError(err, 'Ocurrió un error', ``)
          );
      })
      .catch((err) => this._api.handleError(err, 'Ocurrió un error', ``));
  }

  post() {
    this._toast
      .sweetConfirm('Guardar', '¿Desea guardar el usuario?')
      .then((res) => {
        if (res)
          this._users.post(this.userForm.value).subscribe(
            (res: any) => this._api.handleSuccess(res, '¡Guardado!', ``),
            (err) => this._api.handleError(err, 'Ocurrió un error', ``)
          );
      })
      .catch((err) => this._api.handleError(err, 'Ocurrió un error', ``));
  }

  goTo() {
    this._router
      .navigate(['/usuarios/tab-usuarios'])
      .then(() => this._tabs.setShowTable(true));
  }
}
