import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpOptions } from './httpOptions';
import { map, catchError } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';
import { Brands } from '../models/Brands.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {


  public url: string = this._api.getApiUrl() + '/marca';
  httpOptions = HttpOptions.httpOptions;


  constructor(
    private http: HttpClient, private _api: ApiService,
    private he: HandleErrorService,
    private router: Router) {

  }

  public getPaginated(pageNro: number, pageSize: number): Observable<Brands[]> {
    const params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNro', pageNro.toString())
    return this.http.get<Brands[]>(`${this.url}s/paginado`, { params })
      .pipe(
        map(res => { return <Brands[]>res }),
        catchError(this.he.handleError)
      )
  }

  public getAll() {
    return this.http.get<Brands[]>(`${this.url}s`, this.httpOptions)
      .pipe(
        map(res => { return <Brands[]>res }),
        catchError(this.he.handleError)
      );
  }

  public update(brand: Brands): Observable<Brands> {
    return this.http.put<Brands>(`${this.url}/${brand.id}`, brand, this.httpOptions)
      .pipe(
        map(res => { return <Brands>res }),
        catchError(this.he.handleError)
      );
  }

  public post(brand: Brands): Observable<Brands> {
    return this.http.post<Brands>(`${this.url}s`, brand, this.httpOptions)
      .pipe(
        map(res => { return <Brands>res }),
        catchError(this.he.handleError)
      );
  }

  public delete(id: number): Observable<Brands> {
    return this.http.delete<Brands>(`${this.url}/${id}`, this.httpOptions)
      .pipe(
        map(res => { return <Brands>res; }),
        catchError(this.he.handleError)
      );
  }

}
