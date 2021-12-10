import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpOptions } from './httpOptions';
import { map, catchError } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';
import { Users } from '../models/Users.model';
import { ApiService } from './api.service';
import { Role } from '../models/Role.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  public url: string = this._api.getApiUrl() + "/usuario";
  httpOptions = HttpOptions.httpOptions;
  private usuarios: Users[] = null;


  user: Users;
  UsuarioSubject = new Subject<Users>();
  refreshSub = new Subject<boolean>();

  constructor(
    private http: HttpClient, private _api: ApiService,
    private he: HandleErrorService,
    private router: Router) {
  }

  public hasSuperAdminRole(roles: Role[]) {
    if (roles)
      return roles.some(r => r.role === "SUPERADMIN")
    return false;
  }

  public hasAdminRole(roles: Role[]) {
    if (roles)
      return roles.some(r => r.role === "ADMIN")
    return false;
  }

  public hasUserRole(roles: Role[]) {
    if (roles)
      return roles.some(r => r.role === "USUARIO")
    return false;
  }

  public passUser(user: Users): void {
    return this.UsuarioSubject.next(user);
  }

  public obsUser(): Observable<Users> {
    return this.UsuarioSubject.asObservable();
  }

  public refreshPag(ref: boolean): void {
    return this.refreshSub.next(ref);
  }

  public obsRefresh(): Observable<boolean> {
    return this.refreshSub.asObservable();
  }

  public getPaginated(pageNro: number, pageSize: number): Observable<Users[]> {
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNro', pageNro.toString())
    return this.http.get<Users[]>(`${this.url}s/paginado`, { params })
      .pipe(
        map(res => { return <Users[]>res }),
        catchError(this.he.handleError)
      )
  }


  public getPaginatedByTxtAndFilter(
    pageNro: number, pageSize: number,
    attribute: string, text: string,
    role: string, isActive: boolean,
  ): Observable<Users[]> {

    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNro', pageNro.toString())
      .set('attribute', attribute)
      .set('text', text)
      .set('roles', role)
      .set('isActive', isActive.toString());

    return this.http.get<Users[]>(`${this.url}s/paginado/filter`, { params })
      .pipe(
        map(res => { return <Users[]>res }),
        catchError(this.he.handleError)
      );
  }

  //  ====================================================================================
  public getAll() {
    return this.http.get<Users[]>(`${this.url}s`, this.httpOptions)
      .pipe(
        map(res => { return <Users[]>res }),
        catchError(this.he.handleError)
      );
  }

  public update(user: Users): Observable<Users> {
    return this.http.put<Users>(`${this.url}/${user.id}`, user, this.httpOptions)
      .pipe(
        map(res => { return <Users>res }),
        catchError(this.he.handleError)
      );
  }

  public post(user: Users): Observable<Users> {
    return this.http.post<Users>(`${this.url}s`, user, this.httpOptions)
      .pipe(
        map(res => { return <Users>res })
        // catchError(this.he.handleError)
      );
  }

  public delete(id: number): Observable<Users> {
    return this.http.delete<Users>(`${this.url}/${id}`, this.httpOptions)
      .pipe(
        map(res => { return <Users>res; }),
        catchError(this.he.handleError)
      );
  }

}
