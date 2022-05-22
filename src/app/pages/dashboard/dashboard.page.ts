import { Component, OnInit } from '@angular/core'
import { icons } from 'src/assets/icons'
import { UsersService } from 'src/app/services/users.service'
import { Subscription } from 'rxjs/internal/Subscription'
import { Observable } from 'rxjs'
import { Users } from 'src/app/models/Users.model'
import { AuthService } from 'src/app/services/auth/auth.service'

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
    icons = icons
    comSubs: Subscription
    isLogged$: Observable<boolean>
    public usuario: Users

    constructor(public _users: UsersService, private _auth: AuthService) {
        this.comSubs = this._auth.getUser().subscribe({
            next: (user: Users) => {
                if (user == null) return
                this.usuario = user
            },
            error: (err) => console.log('Error', err),
        })
    }

    ngOnInit() {}
}
