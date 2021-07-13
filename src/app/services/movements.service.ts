import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpOptions } from './httpOptions';
import { map, catchError } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';
import { Movements } from '../models/Movements.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  public url: string = this._api.getApiUrl() + '/movimiento';
  httpOptions = HttpOptions.httpOptions;
  private movimientos: Movements[] = null;

  constructor(
    private http: HttpClient,
    private _api: ApiService,
    private he: HandleErrorService,
    private router: Router
  ) {}

  public getPaginated(
    pageNro: number,
    pageSize: number
  ): Observable<Movements[]> {
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNro', pageNro.toString());
    return this.http.get<Movements[]>(`${this.url}s/paginado`, { params }).pipe(
      map((res) => {
        return <Movements[]>res;
      }),
      catchError(this.he.handleError)
    );
  }

  public getPaginatedAndFilter(
    pageNro: number,
    pageSize: number,
    attr: string,
    txt: string
  ): Observable<Movements[]> {
    const params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNro', pageNro.toString())
      .set('attr', attr)
      .set('txt', txt);

    return this.http
      .get<Movements[]>(`${this.url}s/paginado/filter`, { params })
      .pipe(
        map((res) => {
          return <Movements[]>res;
        }),
        catchError(this.he.handleError)
      );
  }

  // TODO: en backend
  public getPaginatedByStateAndClientId(
    pageNro: number,
    pageSize: number,
    clientId: string,
    state: string
  ): Observable<Movements[]> {
    const params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNro', pageNro.toString())
      .set('clientId', clientId);

    return this.http
      .get<Movements[]>(`${this.url}s/paginado/clienteId/${clientId}/state/${state}`, {
        params,
      })
      .pipe(
        map((res) => {
          return <Movements[]>res;
        }),
        catchError(this.he.handleError)
      );
  }

  public getPaginatedByClientId(
    pageNro: number,
    pageSize: number,
    clientId: string
  ): Observable<Movements[]> {
    const params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNro', pageNro.toString())
      .set('clientId', clientId);

    return this.http
      .get<Movements[]>(`${this.url}s/paginado/clienteId/${clientId}`, {
        params,
      })
      .pipe(
        map((res) => {
          return <Movements[]>res;
        }),
        catchError(this.he.handleError)
      );
  }

  public getPaginatedByDate(
    pageNro: number,
    pageSize: number,
    date: string
  ): Observable<Movements[]> {
    const params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNro', pageNro.toString());

    return this.http
      .get<Movements[]>(`${this.url}s/paginado/fecha/${date}`, { params })
      .pipe(
        map((res) => {
          return <Movements[]>res;
        }),
        catchError(this.he.handleError)
      );
  }

  public getPaginatedBetweenDates(
    pageNro: number,
    pageSize: number,
    from: string,
    to: string
  ): Observable<Movements[]> {
    const params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNro', pageNro.toString());

    return this.http
      .get<Movements[]>(`${this.url}s/paginado/desde/${from}/hasta/${to}`, {
        params,
      })
      .pipe(
        map((res) => {
          return <Movements[]>res;
        }),
        catchError(this.he.handleError)
      );
  }

  public getAll() {
    return this.http.get<Movements[]>(`${this.url}s`, this.httpOptions).pipe(
      map((res) => {
        return <Movements[]>res;
      }),
      catchError(this.he.handleError)
    );
  }

  public get(id: number) {
    return this.http
      .get<Movements[]>(`${this.url}/${id.toString()}`, this.httpOptions)
      .pipe(
        map((res) => {
          return <Movements[]>res;
        }),
        catchError(this.he.handleError)
      );
  }

  public changeState(id: number, state: string) {
    return this.http
      .post<Movements[]>(
        `${this.url}/${id.toString()}/state/${state}`,
        this.httpOptions
      )
      .pipe(
        map((res) => {
          return <Movements[]>res;
        }),
        catchError(this.he.handleError)
      );
  }

  public update(Movement: Movements): Observable<Movements> {
    return this.http
      .put<Movements>(`${this.url}/${Movement.id}`, Movement, this.httpOptions)
      .pipe(
        map((res) => {
          return <Movements>res;
        }),
        catchError(this.he.handleError)
      );
  }

  public post(movement: Movements): Observable<Movements> {
    return this.http
      .post<Movements>(`${this.url}s`, movement, this.httpOptions)
      .pipe(
        map((res) => {
          return <Movements>res;
        }),
        catchError(this.he.handleError)
      );
  }

  public delete(id: number): Observable<Movements> {
    return this.http
      .delete<Movements>(`${this.url}/${id}`, this.httpOptions)
      .pipe(
        map((res) => {
          return <Movements>res;
        }),
        catchError(this.he.handleError)
      );
  }
}
