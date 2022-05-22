import { Injectable } from '@angular/core'
import { Subject, Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class SidebarService {
    showSide = new Subject<boolean>()

    constructor() {}

    observerShowSide(): Observable<boolean> {
        return this.showSide.asObservable()
    }

    setShowSide(showSide: boolean) {
        this.showSide.next(showSide)
    }
}
