import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { Router } from '@angular/router'
import { HttpOptions } from './httpOptions'
import { map, catchError } from 'rxjs/operators'
import { HandleErrorService } from './handle-error.service'
import { Payments } from '../models/Payments.model'
import { ApiService } from './api.service'

@Injectable({
    providedIn: 'root',
})
export class PaymentsService {
    public url: string = this._api.getApiUrl() + '/pago'
    httpOptions = HttpOptions.httpOptions

    constructor(
        private http: HttpClient,
        private _api: ApiService,
        private he: HandleErrorService,
        private router: Router
    ) {}

    public getPaginated(
        pageNro: number,
        pageSize: number
    ): Observable<Payments[]> {
        const params = new HttpParams()
            .set('pageSize', pageSize.toString())
            .set('pageNro', pageNro.toString())
        return this.http
            .get<Payments[]>(`${this.url}s/paginado`, { params })
            .pipe(
                map((res) => {
                    return <Payments[]>res
                }),
                catchError(this.he.handleError)
            )
    }

    public getAll() {
        return this.http.get<Payments[]>(`${this.url}s`, this.httpOptions).pipe(
            map((res) => {
                return <Payments[]>res
            }),
            catchError(this.he.handleError)
        )
    }

    public update(payment: Payments): Observable<Payments> {
        return this.http
            .put<Payments>(
                `${this.url}/${payment.id}`,
                payment,
                this.httpOptions
            )
            .pipe(
                map((res) => {
                    return <Payments>res
                }),
                catchError(this.he.handleError)
            )
    }

    public post(payment: Payments): Observable<Payments> {
        delete payment.id
        return this.http
            .post<Payments>(`${this.url}s`, payment, this.httpOptions)
            .pipe(
                map((res) => {
                    return <Payments>res
                }),
                catchError(this.he.handleError)
            )
    }

    public delete(payment: any): Observable<Payments> {
        return this.http
            .delete<Payments>(
                `${this.url}/${payment.id}/movimiento/${payment.movimiento}`,
                this.httpOptions
            )
            .pipe(
                map((res) => {
                    return <Payments>res
                }),
                catchError(this.he.handleError)
            )
    }
}
