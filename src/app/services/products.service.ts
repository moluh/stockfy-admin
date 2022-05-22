import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map, catchError, tap } from 'rxjs/operators'
import { Products } from '../models/Products.model'
import { ApiService } from './api.service'
import { HandleErrorService } from './handle-error.service'
import { HttpOptions } from './httpOptions'

@Injectable({
    providedIn: 'root',
})
export class ProductsService {
    public url: string = this._api.getApiUrl() + '/producto'
    httpOptions = HttpOptions.httpOptions

    constructor(
        private http: HttpClient,
        private _api: ApiService,
        private he: HandleErrorService
    ) {}

    public getPaginated(
        pageNro: number,
        pageSize: number
    ): Observable<Products[]> {
        let params = new HttpParams()
            .set('pageSize', pageSize.toString())
            .set('pageNro', pageNro.toString())

        return this.http
            .get<Products[]>(`${this.url}s/paginado`, { params })
            .pipe(
                map((res) => {
                    return <Products[]>res
                }),
                catchError(this.he.handleError)
            )
    }

    public getPaginatedAndFilter(
        pageNro: number,
        pageSize: number,
        attr: string,
        text: string
    ): Observable<Products[]> {
        const params = new HttpParams()
            .set('pageSize', pageSize.toString())
            .set('pageNro', pageNro.toString())
            .set('attr', attr)
            .set('text', text)
        return this.http
            .get<Products[]>(`${this.url}s/paginado/filter`, { params })
            .pipe(
                map((res) => {
                    return <Products[]>res
                }),
                catchError(this.he.handleError)
            )
    }

    public getPaginatedByIdOfAList(
        pageNro: number,
        pageSize: number,
        attr: string,
        id: number
    ): Observable<Products[]> {
        const params = new HttpParams()
            .set('pageSize', pageSize.toString())
            .set('pageNro', pageNro.toString())
            .set('attr', attr)
            .set('id', id.toString())
        return this.http
            .get<Products[]>(`${this.url}s/paginado/list`, { params })
            .pipe(
                map((res) => {
                    return <Products[]>res
                }),
                catchError(this.he.handleError)
            )
    }

    getPaginatedByState(
        pageNro: number,
        pageSize: number,
        state: any
    ): Observable<Products[]> {
        const params = new HttpParams()
            .set('pageSize', pageSize.toString())
            .set('pageNro', pageNro.toString())
            .set('state', state)
        return this.http
            .get<Products[]>(`${this.url}s/paginado/state`, { params })
            .pipe(
                map((res) => {
                    return <Products[]>res
                }),
                catchError(this.he.handleError)
            )
    }

    public getAll() {
        return this.http.get<Products[]>(`${this.url}s`, this.httpOptions).pipe(
            map((res) => {
                return <Products[]>res
            }),
            catchError(this.he.handleError)
        )
    }

    public update(product: Products): Observable<Products> {
        return this.http
            .put<Products>(
                `${this.url}/${product.id}`,
                product,
                this.httpOptions
            )
            .pipe(
                map((res) => {
                    return <Products>res
                }),
                catchError(this.he.handleError)
            )
    }

    public post(product: Products): Observable<Products> {
        delete product.id
        // product.precio_costo = 10;
        // product.precio_venta = 450;
        // product.rebaja = 450;
        product.talles = [{ id: 1 }]
        return this.http
            .post<Products>(`${this.url}s`, product, this.httpOptions)
            .pipe(
                map((res) => {
                    return <Products>res
                }),
                catchError(this.he.handleError)
            )
    }

    public delete(id: number): Observable<Products> {
        return this.http
            .delete<Products>(`${this.url}/${id}`, this.httpOptions)
            .pipe(
                map((res) => {
                    return <Products>res
                }),
                catchError(this.he.handleError)
            )
    }

    public getByCodes(barcode: string): Observable<Products> {
        return this.http
            .get<Products>(`${this.url}/barcode/${barcode}`, this.httpOptions)
            .pipe(
                map((res) => {
                    return <Products>res
                }),
                catchError(this.he.handleError)
            )
    }
}
