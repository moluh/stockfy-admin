import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpOptions } from './httpOptions';
import { map, catchError } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';
import { Clients } from '../models/Clients.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {


  public url: string = this._api.getApiUrl() + "/cliente";
  httpOptions = HttpOptions.httpOptions;
  private clientes: Clients[] = null;


  user: Clients;
  clienteSubject = new Subject<Clients>();
  refreshSub = new Subject<boolean>();

  constructor(
    private http: HttpClient, private _api: ApiService,
    private he: HandleErrorService,
    private router: Router) {
  }

  public getPaginated(pageNro: number, pageSize: number): Observable<Clients[]> {
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNro', pageNro.toString())
    return this.http.get<Clients[]>(`${this.url}s/paginado`, { params })
      .pipe(
        map(res => { return <Clients[]>res }),
        catchError(this.he.handleError)
      )
  }


  public getPaginatedByTxtAndFilter(
    pageNro: number, pageSize: number,
    attribute: string, text: string, isActive: boolean
  ): Observable<Clients[]> {

    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNro', pageNro.toString())
      .set('attribute', attribute)
      .set('text', text)
      .set('isActive', isActive.toString());

    return this.http.get<Clients[]>(`${this.url}s/paginado/filter`, { params })
      .pipe(
        map(res => { return <Clients[]>res }),
        catchError(this.he.handleError)
      );
  }

  //  ====================================================================================
  public getAll() {
    return this.http.get<Clients[]>(`${this.url}s`, this.httpOptions)
      .pipe(
        map(res => { return <Clients[]>res }),
        catchError(this.he.handleError)
      );
  }

  public update(user: Clients): Observable<Clients> {
    return this.http.put<Clients>(`${this.url}/${user.id}`, user, this.httpOptions)
      .pipe(
        map(res => { return <Clients>res }),
        catchError(this.he.handleError)
      );
  }

  public post(user: Clients): Observable<Clients> {
    return this.http.post<Clients>(`${this.url}s`, user, this.httpOptions)
      .pipe(
        map(res => { return <Clients>res }),
        catchError(this.he.handleError)
      );
  }

  public delete(id: number): Observable<Clients> {
    return this.http.delete<Clients>(`${this.url}/${id}`, this.httpOptions)
      .pipe(
        map(res => { return <Clients>res; }),
        catchError(this.he.handleError)
      );
  }

}
