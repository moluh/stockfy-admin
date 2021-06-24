import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Page } from './paginacion';
import { Subscription } from 'rxjs';
import { PaginacionService } from './paginacion.service';

@Component({
  selector: 'app-paginacion',
  templateUrl: './paginacion.component.html',
  styleUrls: ['./paginacion.component.css']
})
export class PaginacionComponent implements OnInit, OnDestroy {

  @Input() pageNro: number = 0;
  @Input() pageSize: number = 10;
  @Output() changePage = new EventEmitter();

  reset: Subscription;
  size: Subscription;
  btn: Subscription;

  blockBtn: boolean = false;

  pageModel: Page = {
    pageNro: this.pageNro,
    pageSize: this.pageSize
  };

  constructor(private _pag: PaginacionService) {

    this.reset = this._pag.returnPagNro().subscribe(val => {
      this.pageModel.pageNro = val;
      this.emit();
    });

    this.size = this._pag.returnPagSize().subscribe(val => {
      this.pageModel.pageSize = val;
      this.emit();
    });

    this.btn = this._pag.returnBtn().subscribe(state => this.blockBtn = state);
  }

  ngOnInit() {
    this.emit();
  }

  emit() {
    this.changePage.emit(this.pageModel);
  }

  next() {
    this.pageModel.pageNro++;
    this.emit();
  }

  back() {
    if (this.pageModel.pageNro == 0) return;
    this.pageModel.pageNro--;
    this.emit();
  }

  ngOnDestroy(): void {
    this.btn.unsubscribe();
    this.reset.unsubscribe();
    this.size.unsubscribe();
  }


}
