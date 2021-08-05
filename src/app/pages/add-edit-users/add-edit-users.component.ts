import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DataSourceService } from 'src/app/services/data.source.service';
import { TabsServices } from 'src/app/services/tabs.service';
import { ToastService } from 'src/app/services/toasts.service';
import { UsersService } from 'src/app/services/users.service';
import { icons } from 'src/assets/icons';

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
    this.createForm();
  }

  ngOnInit(): void {
    // comprobamos si viene un id, es porque modifica, sino es uno nuevo
    if (this._dataSource.simpleObject?.id)
      this.userForm.reset(this._dataSource.simpleObject);

    // limpiamos la data del objeto del servicio
    this._dataSource.simpleObject = {};
  }

  get usernameNoValido() {
    return (
      this.userForm.get('username').invalid &&
      this.userForm.get('username').touched

    );
  }

  get passNoValida() {
    return (
      this.userForm.get('password').invalid && this.userForm.get('password').touched
    );
  }

  get emailNoValido() {
    return (
      this.userForm.get('email').invalid && this.userForm.get('email').touched
    );
  }

  get nombreNoValido() {
    return (
      this.userForm.get('nombre').invalid && this.userForm.get('nombre').touched
    );
  }

  get apellidoNoValido() {
    return (
      this.userForm.get('apellido').invalid && this.userForm.get('apellido').touched
    );
  }

  get roleNoValido() {
    return (
      this.userForm.get('role').invalid && this.userForm.get('role').touched
    );
  }


  createForm() {
    this.userForm = this._fb.group({
      id: [''],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      role: ['', [Validators.required]],
      nombre: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(70)],
      ],
      apellido: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(70),
        ],
      ],
      telefono: [''],
      domicilio: [''],
      provincia: [''],
      localidad: [''],
      avatar: [''],
      recpass: [''],
      created_at: [''],
      updated_at: [''],
      activo: [''],
    });
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
