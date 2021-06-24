import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TOKEN, TOKEN_ORIGINAL, AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private router: Router, private auth: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token: string = sessionStorage.getItem(TOKEN);
    const token_original: string = TOKEN_ORIGINAL;

    // console.log(`
    // \n Peticion: 
    // \n [URL]: ${req.url} 
    // \n [BODY]: ${req.body} 
    // \n [METHOD]: ${req.method} 
    // `);
    

    // Comprobamos si hay token
    if (token) {
      const request = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });

      // Comprobamos si es el original y no se lo modificó
      // if (token !== token_original) {
      //   this.auth.logout();
      // }

      return next.handle(request).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            // no autorizado
            this.auth.logout();
          }
          return throwError(err);
        })
      );

    } else {
      return next.handle(req)
    }

  }


}
