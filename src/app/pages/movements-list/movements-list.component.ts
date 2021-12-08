import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as dayjs from 'dayjs';
import { PaginacionService } from 'src/app/components/paginacion/paginacion.service';
import { Movements } from 'src/app/models/Movements.model';
import { QueryPaginator } from 'src/app/models/QueryPaginator';
import { Users } from 'src/app/models/Users.model';
import { MovementsService } from 'src/app/services/movements.service';
import { PrintMovementService } from 'src/app/services/print-movement.service';
import { ToastService } from 'src/app/services/toasts.service';
import { UsersService } from 'src/app/services/users.service';

const ATTR_LIST = [
  'id',
  'fecha',
  'entre_fechas',
  'comentario',
  'estado',
  'modo_pago',
  'usuario',
];

@Component({
  selector: 'app-movements-list',
  templateUrl: './movements-list.component.html',
  styleUrls: ['./movements-list.component.scss'],
})
export class MovementsListComponent implements OnInit {
  dateFrom: any = dayjs().startOf('month').format('YYYY-MM-DD');
  dateTo: any = dayjs().endOf('month').format('YYYY-MM-DD');
  date: any = dayjs().format('YYYY-MM-DD');
  attr_list: string[] = ATTR_LIST;
  attr_selected: string = ATTR_LIST[0];
  id_filter_list: number = null;
  client_selected: number = 0;
  users: Users[] = [];
  state: boolean = true;
  movements: Movements[] = [];
  movementSelected: Movements = <Movements>{};
  pag = new QueryPaginator();
  searchText: string = '';
  title: string = 'Movimientos';
  paymentForm: FormGroup;
  isFiltering: boolean = false;

  constructor(
    private _toast: ToastService,
    private _movements: MovementsService,
    private _users: UsersService,
    private _pag: PaginacionService,
    private _print: PrintMovementService
  ) {
  }

  ngOnInit(): void {}

  clean() {
    this.paymentForm.reset();
  }

  setMovementSelected(movement: Movements) {
    this.movementSelected = movement;
  }

  removeFilter() {
    this.isFiltering = false;
    this.reset();
  }

  applyFilter() {
    // this._pag.setPag(0);
    this.isFiltering = true;
    this.pag.pageNro = 0;
    this.pag.attribute = this.attr_selected;
    this.pag.text = this.searchText;
    this.getFiltered();
  }

  checkAttrSelected() {
    if (this.attr_selected === 'usuario') this.getClients();
  }

  pageChanged(event: { pageNro: number; pageSize: number }) {
    this.pag.pageNro = event.pageNro;
    this.pag.pageSize = event.pageSize;
    this.getMovements();
  }

  getMovements() {
    this.isFiltering ? this.getFiltered() : this.getPaginated();
  }

  reset(event?: any) {
    this._pag.setPag(0);
    this.isFiltering ? this.getFiltered() : this.getPaginated();
  }

  getFiltered() {
    switch (this.attr_selected) {
      case 'modo_pago':
        this.pag.text = String(this.id_filter_list);
        this.getPaginatedAndFilter();
        break;
      case 'estado':
        this.pag.text = String(this.id_filter_list);
        this.getPaginatedAndFilter();
        break;
      case 'comentario':
        this.getPaginatedAndFilter();
        break;
      case 'usuario':
        this.getPaginatedByClientId();
        break;
      case 'fecha':
        this.getPaginatedByDate();
        break;
      case 'entre_fechas':
        this.getPaginatedBetweenDates();
        break;
      case 'id':
        this.getMovementByIdFilter();
        break;
      default:
        break;
    }
  }

  getPaginatedByClientId() {
    this._movements
      .getPaginatedByClientId(
        this.pag.pageNro,
        this.pag.pageSize,
        String(this.id_filter_list)
      )
      .subscribe(
        (res: Movements[] | any) => this.setData(res),
        (err) => console.log(err)
      );
  }

  getPaginatedByDate() {
    this._movements
      .getPaginatedByDate(this.pag.pageNro, this.pag.pageSize, this.date)
      .subscribe(
        (res: Movements[] | any) => this.setData(res),
        (err) => console.log(err)
      );
  }

  getPaginatedBetweenDates() {
    this._movements
      .getPaginatedBetweenDates(
        this.pag.pageNro,
        this.pag.pageSize,
        this.dateFrom,
        this.dateTo
      )
      .subscribe(
        (res: Movements[] | any) => this.setData(res),
        (err) => console.log(err)
      );
  }

  getPaginatedAndFilter() {
    this._movements
      .getPaginatedAndFilter(
        this.pag.pageNro,
        this.pag.pageSize,
        this.pag.attribute,
        this.pag.text
      )
      .subscribe(
        (res: Movements[] | any) => this.setData(res),
        (err) => console.log(err)
      );
  }

  getPaginated() {
    this._movements.getPaginated(this.pag.pageNro, this.pag.pageSize).subscribe(
      (res: Movements[] | any) => this.setData(res),
      (err) => console.log(err)
    );
  }

  getMovementByIdFilter() {
    this._movements.get(Number(this.searchText)).subscribe(
      (res: Movements[] | any) => this.setData(res),
      (err) => console.log(err)
    );
  }

  getMovement() {
    this._movements.get(this.movementSelected.id).subscribe({
      next: (res: Movements[] | any) => {
        if (res.ok) this.movementSelected = res.data[0];
      },
      error: (err) => this._toast.toastError("",""),
    });
  }

  getTextForChangeState(state) {
    return {
      title:
        state === 'ANULADO'
          ? '¿Mover a movimientos ANULADOS?'
          : state === 'PENDIENTE'
          ? '¿Mover a movimientos PENDIENTES?'
          : '¿Mover a movimientos COMPLETADOS?',

      text:
        state === 'ANULADO'
          ? 'El movimiento no se eliminará, solo dejará impactar en las estadísticas.'
          : state === 'PENDIENTE'
          ? 'El movimiento pasa a estar pendiente de finalización.'
          : 'El movimiento pasa a estar completado.',
    };
  }

  changeState(movementId, state) {
    let msg = this.getTextForChangeState(state);
    this._toast
      .sweetConfirm(msg.title, msg.text)
      .then((res) => {
        if (res)
          this._movements.changeState(movementId, state).subscribe({
            next: (res) => {
              this.getMovements();
            },
            error: (err) => console.log(err),
          });
      })
      .catch((err) => console.log(err));
  }

  // todo: crear un servicio que devuelva solo los ids, nombres y apellidos
  getClients() {
    this._users.getAll();
  }

  setData(res) {    
    if (!res.ok || res.data.length === 0) {
      this._pag.setBlockBtn(true);
      this.movements = [];
    } else {
      this._pag.setBlockBtn(false);
      this.movements = res.data;
    }
    
  }

  generatePdf(action: string = 'open') {
    this._print.generatePdf(action, this.movementSelected);
  }
}
