import {
    Component,
    OnInit,
    OnDestroy,
    AfterViewInit,
    HostListener,
} from '@angular/core'
import { Subscription, Observable } from 'rxjs'
import { Users } from 'src/app/models/Users.model'
import { AuthService } from 'src/app/services/auth/auth.service'
import { SidebarService } from 'src/app/services/sidebar.service'
import { map } from 'rxjs/operators'
import { icons } from 'src/assets/icons'
import { TabsServices } from 'src/app/services/tabs.service'
import { UsersService } from 'src/app/services/users.service'
import { IsEditingService } from 'src/app/services/is-editing.service'
import { Router } from '@angular/router'
import { ToastService } from 'src/app/services/toasts.service'

const ITEM_LIST_FOR_EXPAND_OR_HIDE = {
    productos: false,
    estadisticas: false,
}

const ITEM_LIST = {
    productos: [
        { id: 'productos', name: 'Productos' },
        { id: 'categorias', name: 'Categorías' },
        { id: 'marcas', name: 'Marcas' },
        { id: 'talles', name: 'Talles' },
        { id: 'proveedores', name: 'Proveedores' },
    ],
    estadisticas: [
        { id: 'estadisticas', name: 'Dashboard' },
        { id: 'estadisticas', name: 'Barras' },
        { id: 'estadisticas', name: 'Líneas' },
    ],
}

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy, AfterViewInit {
    icons = icons
    showSide: Subscription
    side: boolean = true
    showDescrip: boolean = true
    itemListDinamic: any = ITEM_LIST_FOR_EXPAND_OR_HIDE
    itemList: any = ITEM_LIST
    comSubs: Subscription
    isLogged$: Observable<boolean>
    public usuario: Users
    urlActive: string = 'dashboard'
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        event.target.innerWidth < 1600 ? this.closeNav() : this.openNav()
    }

    constructor(
        public auth: AuthService,
        private _isEditing: IsEditingService,
        private _side: SidebarService,
        private _tabs: TabsServices,
        public _users: UsersService,
        private _router: Router,
        private _toast: ToastService
    ) {
        this.comSubs = this.auth.getUser().subscribe(
            (user: Users) => {
                if (user == null) return
                this.usuario = user
            },
            (err) => console.log('Error', err)
        )

        this.isLogged$ = this.auth.returnAsObs().pipe(
            map((val) => {
                return val
            })
        )
    }

    ngOnInit() {
        window.innerWidth < 1600 ? this.closeNav() : this.openNav()
    }

    ngAfterViewInit() {
        this.showSide = this._side
            .observerShowSide()
            .subscribe((show: boolean) => {
                if (show) this.openNav()
                else this.closeNav()
            })
    }

    setSide() {
        this.side ? this._side.setShowSide(false) : this._side.setShowSide(true)
        this.side = !this.side
    }

    expandOrHideItem(item: string) {
        this.itemListDinamic[item] = !this.itemListDinamic[item]
    }

    goTo(url: string) {
        const editingForm = this._isEditing.getIsEditingForm()

        if (editingForm.isEditing) {
            this._toast
                .sweetConfirm(
                    `El formulario de "${editingForm.component}" está en edición`,
                    '¿Desea continuar?'
                )
                .then((res) => {
                    if (res) this._router.navigate([url]).then((res) => {})
                })
                .catch((err) => console.log(err))
        } else {
            this._router.navigate([url]).then((res) => {})
        }
    }

    ngOnDestroy(): void {
        this.comSubs.unsubscribe()
        this.showSide.unsubscribe()
    }

    openNav() {
        this.showDescrip = true
        document.getElementById('mySidenav').style.width = '200px'
        document.getElementById('main').style.marginLeft = '200px'
    }

    closeNav() {
        this.showDescrip = false
        document.getElementById('mySidenav').style.width = '40px'
        document.getElementById('main').style.marginLeft = '40px'
    }

    showTable() {
        this._tabs.setShowTable(true)
    }
}
