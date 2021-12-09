import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpOptions } from './httpOptions';
import { map, catchError } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';
import { Modules } from '../models/Modules.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ModulesService {
  public url: string = this._api.getApiUrl() + '/modulo';
  httpOptions = HttpOptions.httpOptions;

  constructor(
    private http: HttpClient,
    private _api: ApiService,
    private he: HandleErrorService
  ) {}

  public getPaginated(
    pageNro: number,
    pageModule: number
  ): Observable<Modules[]> {
    const params = new HttpParams()
      .set('pageModule', pageModule.toString())
      .set('pageNro', pageNro.toString());
    return this.http.get<Modules[]>(`${this.url}s/paginado`, { params }).pipe(
      map((res) => {
        return <Modules[]>res;
      }),
      catchError(this.he.handleError)
    );
  }

  public getAll() {
    return this.http.get<Modules[]>(`${this.url}s`, this.httpOptions).pipe(
      map((res) => {
        return <Modules[]>res;
      }),
      catchError(this.he.handleError)
    );
  }

  public update(module: Modules): Observable<Modules> {
    return this.http
      .put<Modules>(`${this.url}/${module.id}`, module, this.httpOptions)
      .pipe(
        map((res) => {
          return <Modules>res;
        }),
        catchError(this.he.handleError)
      );
  }

  public post(module: Modules): Observable<Modules> {
    return this.http
      .post<Modules>(`${this.url}s`, module, this.httpOptions)
      .pipe(
        map((res) => {
          return <Modules>res;
        }),
        catchError(this.he.handleError)
      );
  }

  public delete(id: number): Observable<Modules> {
    return this.http
      .delete<Modules>(`${this.url}/${id}`, this.httpOptions)
      .pipe(
        map((res) => {
          return <Modules>res;
        }),
        catchError(this.he.handleError)
      );
  }
}
