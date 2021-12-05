import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TOKEN, AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private router: Router, private auth: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // console.log(`
    // \n Peticion: 
    // \n [URL]: ${req.url} 
    // \n [BODY]: ${req.body} 
    // \n [METHOD]: ${req.method} 
    // `);    

    const token: string = sessionStorage.getItem(TOKEN);

    if (token) {
      const request = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });

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
