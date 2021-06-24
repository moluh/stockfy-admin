import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpOptions } from './httpOptions';
import { map, catchError } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';
import { Categories } from '../models/Categories.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {


  public url: string = this._api.getApiUrl() + '/categoria';
  httpOptions = HttpOptions.httpOptions;


  constructor(
    private http: HttpClient, private _api: ApiService,
    private he: HandleErrorService,
    private router: Router) {



  }

  public getPaginated(pageNro: number, pageSize: number): Observable<Categories[]> {
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNro', pageNro.toString())
    return this.http.get<Categories[]>(`${this.url}s/paginado`, { params })
      .pipe(
        map(res => { return <Categories[]>res }),
        catchError(this.he.handleError)
      )
  }

  //  ====================================================================================
  public getAll() {
    return this.http.get<Categories[]>(`${this.url}s`, this.httpOptions)
      .pipe(
        map(res => { return <Categories[]>res }),
        catchError(this.he.handleError)
      );
  }

  public update(category: Categories): Observable<Categories> {
    return this.http.put<Categories>(`${this.url}/${category.id}`, category, this.httpOptions)
      .pipe(
        map(res => { return <Categories>res }),
        catchError(this.he.handleError)
      );
  }

  public post(category: Categories): Observable<Categories> {
    return this.http.post<Categories>(`${this.url}s`, category, this.httpOptions)
      .pipe(
        map(res => { return <Categories>res }),
        catchError(this.he.handleError)
      );
  }

  public delete(id: number): Observable<Categories> {
    return this.http.delete<Categories>(`${this.url}/${id}`, this.httpOptions)
      .pipe(
        map(res => { return <Categories>res }),
        catchError(this.he.handleError)
      );
  }

}
