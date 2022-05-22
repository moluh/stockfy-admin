import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { Router } from '@angular/router'
import { HttpOptions } from './httpOptions'
import { map, catchError } from 'rxjs/operators'
import { HandleErrorService } from './handle-error.service'
import { Expenses } from '../models/Expenses.model'
import { ApiService } from './api.service'

@Injectable({
    providedIn: 'root',
})
export class ExpensesService {
    public url: string = this._api.getApiUrl() + '/gasto'
    httpOptions = HttpOptions.httpOptions
    private expenses: Expenses[] = null

    exp: Expenses
    expenseSubject = new Subject<Expenses>()
    refreshSub = new Subject<boolean>()

    constructor(
        private http: HttpClient,
        private _api: ApiService,
        private he: HandleErrorService,
        private router: Router
    ) {}

    public getPaginated(
        pageNro: number,
        pageSize: number
    ): Observable<Expenses[]> {
        let params = new HttpParams()
            .set('pageSize', pageSize.toString())
            .set('pageNro', pageNro.toString())
        return this.http
            .get<Expenses[]>(`${this.url}s/paginado`, { params })
            .pipe(
                map((res) => {
                    return <Expenses[]>res
                }),
                catchError(this.he.handleError)
            )
    }

    public getPaginatedByTxtAndFilter(
        pageNro: number,
        pageSize: number,
        attribute: string,
        text: string,
        isActive: boolean
    ): Observable<Expenses[]> {
        let params = new HttpParams()
            .set('pageSize', pageSize.toString())
            .set('pageNro', pageNro.toString())
            .set('attribute', attribute)
            .set('text', text)
            .set('isActive', isActive.toString())

        return this.http
            .get<Expenses[]>(`${this.url}s/paginado/filter`, { params })
            .pipe(
                map((res) => {
                    return <Expenses[]>res
                }),
                catchError(this.he.handleError)
            )
    }

    //  ====================================================================================
    public getAll() {
        return this.http.get<Expenses[]>(`${this.url}s`, this.httpOptions).pipe(
            map((res) => {
                return <Expenses[]>res
            }),
            catchError(this.he.handleError)
        )
    }

    public update(exp: Expenses): Observable<Expenses> {
        return this.http
            .put<Expenses>(`${this.url}/${exp.id}`, exp, this.httpOptions)
            .pipe(
                map((res) => {
                    return <Expenses>res
                }),
                catchError(this.he.handleError)
            )
    }

    public post(exp: Expenses): Observable<Expenses> {
        delete exp.id
        return this.http
            .post<Expenses>(`${this.url}s`, exp, this.httpOptions)
            .pipe(
                map((res) => {
                    return <Expenses>res
                }),
                catchError(this.he.handleError)
            )
    }

    public delete(id: number): Observable<Expenses> {
        return this.http
            .delete<Expenses>(`${this.url}/${id}`, this.httpOptions)
            .pipe(
                map((res) => {
                    return <Expenses>res
                }),
                catchError(this.he.handleError)
            )
    }
}
