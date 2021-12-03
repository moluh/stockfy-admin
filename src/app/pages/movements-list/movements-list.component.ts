import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { PaginacionService } from 'src/app/components/paginacion/paginacion.service';
import { Movements } from 'src/app/models/Movements.model';
import { QueryPaginator } from 'src/app/models/QueryPaginator';
import { Users } from 'src/app/models/Users.model';
import { DatesService } from 'src/app/services/dates.service';
import { MovementsService } from 'src/app/services/movements.service';
import { PaymentsService } from 'src/app/services/payments.service';
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
  'cliente',
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
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _movements: MovementsService,
    private _payments: PaymentsService,
    private _date: DatesService,
    private _users: UsersService,
    private _pag: PaginacionService,
    private _print: PrintMovementService
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  clean() {
    this.paymentForm.reset();
  }

  isValidPayment() {
    const hasProfit: boolean = this.paymentForm.controls['interes'].value;
    const tasa: number = this.paymentForm.controls['tasa_interes'].value;
    const monto: number = this.paymentForm.controls['monto'].value;
    const fecha: Date = this.paymentForm.controls['fecha'].value;

    if (hasProfit) {
      if (tasa === 0 || tasa === undefined || tasa === null)
        return this._toast.toastAlert('Complete el porcentaje de interés.', '');
      if (monto === 0 || monto === undefined || monto === null)
        return this._toast.toastAlert('Complete el monto del pago.', '');
      if (fecha === undefined || fecha === null)
        return this._toast.toastAlert('Complete la fecha del pago.', '');
    }

    if (this.movementSelected.saldo < monto)
      return this._toast.toastAlert('El monto del pago supera el saldo.', '');

    this.postPayment();
  }

  calculateProfit() {
    const hasProfit: boolean = this.paymentForm.controls['interes'].value;
    const tasa: number = this.paymentForm.controls['tasa_interes'].value;
    const monto: number = this.paymentForm.controls['monto'].value;

    if (tasa !== null && monto !== null)
      this.paymentForm.controls['ganancia'].setValue(monto * (tasa / 100));
    else this.paymentForm.controls['ganancia'].setValue(0);

    if (!hasProfit) {
      this.paymentForm.controls['ganancia'].setValue(0);
      this.paymentForm.controls['tasa_interes'].setValue(0);
    }
  }

  deletePayment(payment) {
    payment.movimiento = this.movementSelected.id;
    this._toast
      .sweetConfirm(
        '¿Eliminar pago?',
        'Una vez eliminado no se podrá recuperar.'
      )
      .then((res) => {
        if (res)
          this._payments.delete(payment).subscribe({
            next: (res) => {
              this._toast.sweetAlert('¡Pago eliminado!', '');
              this.getMovement();
              this.getMovements();
            },
            error: (err) => console.log(err),
          });
      })
      .catch((err) => console.log(err));
  }

  postPayment() {
    this.paymentForm.controls['movimientoId'].setValue(
      this.movementSelected.id
    );
    this.paymentForm.controls['pago_nro'].setValue(
      this.movementSelected.pagos.length++
    );

    this._toast
      .sweetConfirm('¿Confirmar pago?', '')
      .then((res) => {
        if (res)
          this._payments.post(this.paymentForm.value).subscribe(
            (res) => {
              this._toast.sweetAlert('¡Pago agregado!', '');
              this.getMovement();
              this.getMovements();
              this.clean();
            },
            (err) => console.log(err)
          );
      })
      .catch((err) => console.log(err));
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
    if (this.attr_selected === 'cliente') this.getClients();
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
      case 'cliente':
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

  setSelectedMovement(movement: Movements) {
    this.movementSelected = movement;
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

  createForm() {
    this.paymentForm = this._fb.group({
      id: [''],
      pago_nro: [],
      monto: ['', [Validators.required, Validators.minLength(1)]],
      fecha: [
        this._date.getActualDate(),
        [Validators.required, Validators.minLength(1)],
      ],
      tasa_interes: [null],
      interes: [true],
      ganancia: [0],
      movimientoId: [],
    });
  }

  // todo: crear un servicio que devuelva solo los ids, nombres y apellidos
  getClients() {
    this._users.getAll();
  }

  setData(res) {
    console.log('res', res);
    console.log('this.movements 1', this.movements);

    if (!res.ok || res.data.length === 0) {
      this._pag.setBlockBtn(true);
      this.movements = [];
    } else {
      this._pag.setBlockBtn(false);
      this.movements = res.data;
    }
    console.log('this.movements 2', this.movements);
    console.log('===================');
  }

  generatePdf(action: string = 'open') {
    this._print.generatePdf(action, this.movementSelected);
  }
}
