import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleErrorService } from './handle-error.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {


  constructor(private http: HttpClient, private he: HandleErrorService) { }



}
