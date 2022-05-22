import { Injectable } from '@angular/core'
import { Subject, Observable, BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class TabsServices {
    showTable = new BehaviorSubject<boolean>(true)

    constructor() {}

    observerShowTable(): Observable<boolean> {
        return this.showTable.asObservable()
    }

    setShowTable(showTable: boolean) {
        this.showTable.next(showTable)
    }
}
