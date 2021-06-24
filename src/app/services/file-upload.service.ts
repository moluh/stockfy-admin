import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { HttpClient, HttpHeaders, HttpEventType, HttpParams } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HandleErrorService } from './handle-error.service';
import { ToastService } from './toasts.service';
import { ApiService } from './api.service';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {


  constructor(private http: HttpClient, private _auth: AuthService, private _toast: ToastService,
    private he: HandleErrorService, private _api: ApiService) {

  }

  public UrlRest: string = this._api.getApiUrl();

  onUploadCsv(fd: FormData): Observable<any> {
    return this.http.post(`${this.UrlRest}/productos/csv/upload`, fd, {
      reportProgress: true,
      observe: 'events'
    }).pipe(catchError(this.he.handleError))
  }

}
