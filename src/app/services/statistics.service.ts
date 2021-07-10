import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleErrorService } from './handle-error.service';
import { HttpOptions } from './httpOptions';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  
  public url: string = this._api.getApiUrl() + '/estadisticas';
  httpOptions = HttpOptions.httpOptions;

  constructor(
    private http: HttpClient,
    private _api: ApiService,
    private he: HandleErrorService
  ) {}

  public getBetweenDatesDashboard(from, to): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}`, {from, to}).pipe(
      map((res) => {
        return <any[]>res[0];
      }),
      catchError(this.he.handleError)
    );
  }

  public getBetweenDatesGraphic(from, to): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}/grafico`, {from, to}).pipe(
      map((res) => {
        return <any[]>res;
      }),
      catchError(this.he.handleError)
    );
  }

}
