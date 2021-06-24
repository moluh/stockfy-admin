import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpOptions } from './httpOptions';
import { map, catchError } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';
import { Providers } from '../models/Providers.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {

  public url: string = this._api.getApiUrl() + '/proveedor';
  httpOptions = HttpOptions.httpOptions;

  constructor(
    private http: HttpClient, private _api: ApiService,
    private he: HandleErrorService) {

  }

  public getPaginated(pageNro: number, pageSize: number): Observable<Providers[]> {
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNro', pageNro.toString())
    return this.http.get<Providers[]>(`${this.url}es/paginado`, { params })
      .pipe(
        map(res => <Providers[]>res),
        catchError(this.he.handleError)
      )
  }

  public getAll() {
    return this.http.get<Providers[]>(`${this.url}es`, this.httpOptions)
      .pipe(
        map(res => { return <Providers[]>res }),
        catchError(this.he.handleError)
      );
  }

  public update(provider: Providers): Observable<Providers> {
    return this.http.put<Providers>(`${this.url}/${provider.id}`, provider, this.httpOptions)
      .pipe(
        map(res => { return <Providers>res }),
        catchError(this.he.handleError)
      );
  }

  public post(provider: Providers): Observable<Providers> {
    return this.http.post<Providers>(`${this.url}es`, provider, this.httpOptions)
      .pipe(
        map(res => { return <Providers>res }),
        catchError(this.he.handleError)
      );
  }

  public delete(id: number): Observable<Providers> {
    return this.http.delete<Providers>(`${this.url}/${id}`, this.httpOptions)
      .pipe(
        map(res => { return <Providers>res; }),
        catchError(this.he.handleError)
      );
  }

}
