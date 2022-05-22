import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { Router } from '@angular/router'
import { HttpOptions } from './httpOptions'
import { map, catchError } from 'rxjs/operators'
import { HandleErrorService } from './handle-error.service'
import { Role } from '../models/Role.model'
import { ApiService } from './api.service'

@Injectable({
    providedIn: 'root',
})
export class RolesService {
    public url: string = this._api.getApiUrl() + '/role'
    httpOptions = HttpOptions.httpOptions

    constructor(
        private http: HttpClient,
        private _api: ApiService,
        private he: HandleErrorService,
        private router: Router
    ) {}

    public getPaginated(pageNro: number, pageRole: number): Observable<Role[]> {
        const params = new HttpParams()
            .set('pageRole', pageRole.toString())
            .set('pageNro', pageNro.toString())
        return this.http.get<Role[]>(`${this.url}s/paginado`, { params }).pipe(
            map((res) => {
                return <Role[]>res
            }),
            catchError(this.he.handleError)
        )
    }

    public getAll() {
        return this.http.get<Role[]>(`${this.url}s`, this.httpOptions).pipe(
            map((res) => {
                return <Role[]>res
            }),
            catchError(this.he.handleError)
        )
    }

    public update(brand: Role): Observable<Role> {
        return this.http
            .put<Role>(`${this.url}/${brand.id}`, brand, this.httpOptions)
            .pipe(
                map((res) => {
                    return <Role>res
                }),
                catchError(this.he.handleError)
            )
    }

    public post(brand: Role): Observable<Role> {
        return this.http
            .post<Role>(`${this.url}s`, brand, this.httpOptions)
            .pipe(
                map((res) => {
                    return <Role>res
                }),
                catchError(this.he.handleError)
            )
    }

    public delete(id: number): Observable<Role> {
        return this.http
            .delete<Role>(`${this.url}/${id}`, this.httpOptions)
            .pipe(
                map((res) => {
                    return <Role>res
                }),
                catchError(this.he.handleError)
            )
    }
}
