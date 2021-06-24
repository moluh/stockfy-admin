import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HandleErrorService {

  constructor() { }

  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('Ocurrió un error:', error.error.message);

    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Código de Error: ${error.status}, ` +
        `Body error: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Algo salió mal. Intenta nuevamente más tarde.');
  }

}
