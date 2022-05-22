import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { Router } from '@angular/router'
import { HttpOptions } from './httpOptions'
import { map, catchError } from 'rxjs/operators'
import { HandleErrorService } from './handle-error.service'
import { Sizes } from '../models/Sizes.model'
import { ApiService } from './api.service'

@Injectable({
    providedIn: 'root',
})
export class SizesService {
    public url: string = this._api.getApiUrl() + '/talle'
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
    ): Observable<Sizes[]> {
        const params = new HttpParams()
            .set('pageSize', pageSize.toString())
            .set('pageNro', pageNro.toString())
        return this.http.get<Sizes[]>(`${this.url}s/paginado`, { params }).pipe(
            map((res) => {
                return <Sizes[]>res
            }),
            catchError(this.he.handleError)
        )
    }

    public getAll() {
        return this.http.get<Sizes[]>(`${this.url}s`, this.httpOptions).pipe(
            map((res) => {
                return <Sizes[]>res
            }),
            catchError(this.he.handleError)
        )
    }

    public update(brand: Sizes): Observable<Sizes> {
        return this.http
            .put<Sizes>(`${this.url}/${brand.id}`, brand, this.httpOptions)
            .pipe(
                map((res) => {
                    return <Sizes>res
                }),
                catchError(this.he.handleError)
            )
    }

    public post(brand: Sizes): Observable<Sizes> {
        return this.http
            .post<Sizes>(`${this.url}s`, brand, this.httpOptions)
            .pipe(
                map((res) => {
                    return <Sizes>res
                }),
                catchError(this.he.handleError)
            )
    }

    public delete(id: number): Observable<Sizes> {
        return this.http
            .delete<Sizes>(`${this.url}/${id}`, this.httpOptions)
            .pipe(
                map((res) => {
                    return <Sizes>res
                }),
                catchError(this.he.handleError)
            )
    }
}
