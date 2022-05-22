import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms'
import { Router } from '@angular/router'
import { Modules } from 'src/app/models/Modules.model'
import { Role } from 'src/app/models/Role.model'
import { ApiService } from 'src/app/services/api.service'
import { DataSourceService } from 'src/app/services/data.source.service'
import { ModulesService } from 'src/app/services/modules.service'
import { RolesService } from 'src/app/services/roles.service'
import { TabsServices } from 'src/app/services/tabs.service'
import { ToastService } from 'src/app/services/toasts.service'
import { UsersService } from 'src/app/services/users.service'

@Component({
    selector: 'app-add-edit-users',
    templateUrl: './add-edit-users.component.html',
    styleUrls: ['./add-edit-users.component.scss'],
})
export class AddEditUsersComponent implements OnInit {
    @ViewChild('closeModal') private closeModal: ElementRef
    @Input() isNewUserFromSells: boolean = false
    userForm: FormGroup
    isEditing: boolean = false
    rolesAvailable: Role[] = []
    modulosAvailable: Modules[] = []
    listaModulos: Modules[] = []
    typeForm: string = 'new'

    constructor(
        private _users: UsersService,
        private _role: RolesService,
        private _router: Router,
        private _fb: FormBuilder,
        private _toast: ToastService,
        private _tabs: TabsServices,
        private _dataSource: DataSourceService,
        private _api: ApiService,
        private _modules: ModulesService
    ) {
        this.createForm()
        this.getRoles()
        this.getModules()
    }

    ngOnInit(): void {
        // comprobamos si viene un id, es porque modifica, sino es uno nuevo
        if (this._dataSource.simpleObject?.id) {
            this.typeForm = 'edit'
            this.loadForm(this._dataSource.simpleObject)
        } else {
            this.typeForm = 'new'
            // limpiamos la data del objeto del servicio
            this._dataSource.simpleObject = {}
        }
    }

    loadForm(user) {
        this.userForm.reset(user)
        this.userForm.setControl('roles', this._fb.array(user.roles))
        this.userForm.setControl('modulos', this._fb.array(user.modulos))
    }

    get usernameNoValido() {
        return (
            this.userForm.get('username').invalid &&
            this.userForm.get('username').touched &&
            !this.isNewUserFromSells
        )
    }

    get passNoValida() {
        return (
            this.userForm.get('password').invalid &&
            this.userForm.get('password').touched &&
            !this.isNewUserFromSells
        )
    }

    get emailNoValido() {
        return (
            this.userForm.get('email').invalid &&
            this.userForm.get('email').touched &&
            !this.isNewUserFromSells
        )
    }

    get nombreNoValido() {
        return (
            this.userForm.get('nombre').invalid &&
            this.userForm.get('nombre').touched
        )
    }

    get apellidoNoValido() {
        return (
            this.userForm.get('apellido').invalid &&
            this.userForm.get('apellido').touched
        )
    }

    get roleNoValido() {
        return (
            this.userForm.get('roles').invalid &&
            this.userForm.get('roles').touched &&
            !this.isNewUserFromSells
        )
    }

    get roles() {
        return this.userForm.get('roles') as FormArray
    }

    addRoleToFormArray(role) {
        if (this.roles.value.some((el) => el.id === role.id))
            return this._toast.toastAlert('Ya se encuentra agregado', '')
        this.roles.push(this._fb.control(role))
    }

    removeRoleFromFormArray(i) {
        this.roles.removeAt(i)
    }

    get modulos() {
        return this.userForm.get('modulos') as FormArray
    }

    addModuleToFormArray(modulo) {
        if (this.modulos.value.some((el) => el.id === modulo.id))
            return this._toast.toastAlert('Ya se encuentra agregado', '')
        this.modulos.push(this._fb.control(modulo))
    }

    removeModuleFromFormArray(i) {
        this.modulos.removeAt(i)
    }

    getRoles() {
        this._role.getAll().subscribe({
            next: (res: any) => {
                this.rolesAvailable = res['data']
            },
            error: (err) => {
                console.log(err)
            },
        })
    }

    getModules() {
        this._modules.getAll().subscribe({
            next: (res: any) => {
                Object.assign(this.modulosAvailable, res.data)
                const copyArray = res.data.map((e) => {
                    return { ...e }
                })
                this.transformModulos(copyArray)
            },
            error: (err) => {
                console.log(err)
            },
        })
    }

    transformModulos(mods: Modules[]) {
        // Elimina los permisos del modulo (_W, _R...)
        mods = mods.map((m: Modules, i) => {
            m.modulo = m.modulo.slice(0, -2)
            return m
        })

        this.listaModulos = [
            ...new Map(mods.map((m) => [m.modulo, m])).values(),
        ]
    }

    checkIfWasAdded(modulo) {
        if (this.modulos.value.some((el) => el.id === modulo.id))
            return { selected: true }
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
                    Validators.pattern(
                        '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'
                    ),
                ],
            ],
            roles: this._fb.array([]), // Validators.required ????
            modulos: this._fb.array([]), // Validators.required ????
            nombre: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(70),
                ],
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
        })
    }

    send() {
        this.userForm.get('id').value === '' ? this.post() : this.update()
    }

    compareRol(c1: any, c2: any): boolean {
        return c1 && c2 ? c1 === c2 : c1 === c2
    }

    public hideModal() {
        this.closeModal.nativeElement.click()
    }

    update() {
        this._toast
            .sweetConfirm('Confirmar cambios', '¿Desea guardar los cambios?')
            .then((res) => {
                if (res)
                    this._users.update(this.userForm.value).subscribe(
                        (res: any) =>
                            this._api.handleSuccess(res, '¡Guardado!', ``),
                        (err) =>
                            this._api.handleError(err, 'Ocurrió un error', ``)
                    )
            })
            .catch((err) => this._api.handleError(err, 'Ocurrió un error', ``))
    }

    post() {
        // if (this.isNewUserFromSells)
        //   this.addRoleToFormArray({ id: 2, roles: 'USUARIO' });

        this._toast
            .sweetConfirm('Guardar', '¿Desea guardar el usuario?')
            .then((res) => {
                if (res)
                    this._users.post(this.userForm.value).subscribe({
                        next: (resp: any) => {
                            this._api.handleSuccess(resp, '¡Guardado!', ``)
                            this.hideModal()
                        },
                        error: (err) =>
                            this._api.handleError(err, 'Ocurrió un error', ``),
                    })
            })
            .catch((err) => this._api.handleError(err, 'Ocurrió un error', ``))
    }

    goTo() {
        this._router
            .navigate(['/usuarios/tab-usuarios'])
            .then(() => this._tabs.setShowTable(true))
    }
}
