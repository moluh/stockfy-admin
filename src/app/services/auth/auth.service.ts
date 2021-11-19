import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { Users } from 'src/app/models/Users.model';
import { ToastService } from '../toasts.service';
import { HttpOptions } from '../httpOptions';
import jwt_decode from 'jwt-decode';
import { ApiService } from '../api.service';
import { ToastrService } from 'ngx-toastr';

export const TOKEN: string = '_zD';
export let TOKEN_ORIGINAL: string = 'token_original';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public url: string = this._api.getApiUrl() + '/login';
  httpOptions = HttpOptions.httpOptions;

  isLoginSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  usuarioSubject = new BehaviorSubject<Users>(this.returnUser());

  constructor(
    private http: HttpClient,
    private router: Router,
    private _toast: ToastService,
    private _api: ApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit() { }

  public returnAsObs(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }

  public isLoggedIn(token?: string): boolean {
    if (!token) token = sessionStorage.getItem(TOKEN);

    if (!token) return this.logout();

    const date: Date = this.getTokenExpirationDate(token);

    if (date === undefined) return true;

    if (!(date.valueOf() > new Date().valueOf()))
      return this.logout('Tu sesión expiró, ingresa nuevamente');
    else return true;
  }

  public getUser(): Observable<Users> {
    return this.usuarioSubject.asObservable();
  }

  public returnUser(): Users {
    let user: Users;
    const TOKEN_: string = sessionStorage.getItem(TOKEN);
    if (TOKEN_ === null) return null;
    else user = jwt_decode(TOKEN_);
    return user;
  }

  public login(credentials: any): void {
    this.http.post(`${this.url}`, credentials, this.httpOptions).subscribe({
      next: (data: any) => {
        if (!data.isLogged) {
          this.isLoginSubject.next(false);
          return;
        } else {
          const TOKEN_: any = jwt_decode(data.token);
          const user: Users = { ...TOKEN_ };

          sessionStorage.setItem(TOKEN, data.token);
          TOKEN_ORIGINAL = data.token;

          this.isLoginSubject.next(true);
          this.usuarioSubject.next(user);
          if (user.roles)
            user.roles.some(r => r.role === "ADMIN")
              ? this.router.navigate(['/dashboard'])
              : this.router.navigate(['/ventas']);
        }
      },
      error: (err) => {
        // this._toast.toastError(err.error.error,'')
        this.toastr.error(err.error.error, '');
        console.log('Error: ', err.error.error);
      },
    });
  }

  public logout(msg?: string): boolean {
    this.router.navigate(['/login']).then(() => {
      sessionStorage.removeItem(TOKEN);
      if (msg) this._toast.toastError(msg, '');
      this.isLoginSubject.next(false);
    });

    return false;
  }

  getTokenExpirationDate(token: string): Date {
    const decoded: any = jwt_decode(token);
    if (decoded.exp === undefined)
      return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }
}
