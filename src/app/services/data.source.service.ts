import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class DataSourceService {
    dataSubject = new Subject<any>()
    simpleObject: any

    constructor() {}

    public passData(data: any) {
        return this.dataSubject.next(data)
    }

    public dataObserver(): Observable<any> {
        return this.dataSubject.asObservable()
    }
}
