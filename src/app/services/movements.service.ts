import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpOptions } from './httpOptions';
import { map, catchError } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';
import { Movements } from '../models/Movements.model';
import { ApiService } from './api.service';
import { Store } from '@ngrx/store';
import { selectMovement } from '../store/actions/movementSelected.action';

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  public url: string = this._api.getApiUrl() + '/movimiento';
  httpOptions = HttpOptions.httpOptions;

  movementSelected$: Observable<any>;
  movementSelectedSub: Subscription;
  // movementSubject = new BehaviorSubject<Movements>(this.getMovementSelected());

  constructor(
    private http: HttpClient,
    private _api: ApiService,
    private he: HandleErrorService,
    private store: Store<{ movementSelected: Movements }>
  ) {
    
    this.movementSelected$ = this.store.select('movementSelected');
    this.movementSelectedSub = this.movementSelected$.subscribe();
  }

  setMovementSelected(data: Movements | any) {
    // console.log('data in set mov.. {...data}:',{...data});    
    this.store.dispatch(selectMovement({...data}));
  }

  getMovementSelected() {
    let resp: Movements = <Movements>{}

    this.movementSelectedSub = this.movementSelected$.subscribe({
      next: (res) => {
        this.movementSelectedSub.unsubscribe();
        resp = res;
      },
    });
    
    return resp;
  }  

  // public getMovementSelectedObservable(): Observable<Movements> {
  //   return this.movementSubject.asObservable();
  // }

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
