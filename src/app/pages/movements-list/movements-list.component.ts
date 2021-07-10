import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaginacionService } from 'src/app/components/paginacion/paginacion.service';
import { Movements } from 'src/app/models/Movements.model';
import { QueryPaginator } from 'src/app/models/QueryPaginator';
import { DatesService } from 'src/app/services/dates.service';
import { MovementsService } from 'src/app/services/movements.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { ToastService } from 'src/app/services/toasts.service';

const ATTR_LIST = [
  "fecha",
  "comentario",
  "estado",
  "total",
  "modo_pago",
  "cliente",
  "movimiento_lineas",
]


@Component({
  selector: 'app-movements-list',
  templateUrl: './movements-list.component.html',
  styleUrls: ['./movements-list.component.scss']
})
export class MovementsListComponent implements OnInit {
  attr_list: string[] = ATTR_LIST;
  attr_selected
  client_selected: number = 0;
  state: boolean = true;
  movements: Movements[] = [];
  movementSelected: Movements = <Movements>{};
  pag = new QueryPaginator();
  searchText: string = "";
  title: string = "Movimientos"
  paymentForm: FormGroup;



  constructor(
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _movements: MovementsService,
    private _payments: PaymentsService,
    private _date: DatesService,
    private _pag: PaginacionService) {

    this.paymentForm = this._fb.group({
      id: [''],
      pago_nro: [],
      monto: ['', [Validators.required, Validators.minLength(1)]],
      fecha: [this._date.getActualDate(), [Validators.required, Validators.minLength(1)]],
      tasa_interes: [null],
      interes: [true],
      ganancia: [0],
      movimientoId: []
    });

  }

  ngOnInit(): void {
  }


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
        return this._toast.toastAlert("Complete el porcentaje de interés.", "")
      if (monto === 0 || monto === undefined || monto === null)
        return this._toast.toastAlert("Complete el monto del pago.", "")
      if (fecha === undefined || fecha === null)
        return this._toast.toastAlert("Complete la fecha del pago.", "")
    }

    if (this.movementSelected.saldo < monto)
      return this._toast.toastAlert("El monto del pago supera el saldo.", "")

    this.postPayment();

  }

  calculateProfit() {
    const hasProfit: boolean = this.paymentForm.controls['interes'].value;
    const tasa: number = this.paymentForm.controls['tasa_interes'].value;
    const monto: number = this.paymentForm.controls['monto'].value;

    if (tasa !== null && monto !== null)
      this.paymentForm.controls['ganancia'].setValue(monto * (tasa / 100));
    else
      this.paymentForm.controls['ganancia'].setValue(0);

    if (!hasProfit) {
      this.paymentForm.controls['ganancia'].setValue(0);
      this.paymentForm.controls['tasa_interes'].setValue(0);
    }
  }

  deletePayment(payment) {
    payment.movimiento = this.movementSelected.id
    this._toast.sweetConfirm("¿Eliminar pago?", "Una vez eliminado no se podrá recuperar.")
      .then(res => {
        if (res)
          this._payments.delete(payment).subscribe(
            (res) => {
              this._toast.sweetAlert("¡Pago eliminado!", "")
              this.getMovement();
            },
            (err) => console.log(err));

      })
      .catch(err => console.log(err))
  }

  postPayment() {
    this.paymentForm.controls['movimientoId'].setValue(this.movementSelected.id)
    this.paymentForm.controls['pago_nro'].setValue(this.movementSelected.pagos.length++)

    this._toast.sweetConfirm("¿Confirmar pago?", "")
      .then(res => {
        if (res)
          this._payments.post(this.paymentForm.value).subscribe(
            (res) => {
              this._toast.sweetAlert("¡Pago agregado!", "")
              this.getMovement()
              this.clean();
            },
            (err) => console.log(err));

      })
      .catch(err => console.log(err))
  }

  pageChanged(event: { pageNro: number; pageSize: number; }) {
    this.pag.pageNro = event.pageNro;
    this.pag.pageSize = event.pageSize;
    this.getPaginated();
  }

  applyFilter() {
    this.pag.pageNro = 0;
    this.pag.attribute = this.attr_selected;
    this.pag.text = this.searchText;
    this.getPaginatedByTxtAndFilter();
  }

  setSelectedMovement(movement: Movements) {
    this.movementSelected = movement;
  }

  getPaginatedByTxtAndFilter() {
    this._movements.getPaginatedByTxtAndFilter(
      this.pag.pageNro, this.pag.pageSize,
      this.pag.attribute, this.client_selected,
      this.state,
    ).subscribe(
      (res: Movements[] | any) => {
        if (!res.ok || res.data.length === 0) {
          this._pag.setBlockBtn(true);
        } else {
          this._pag.setBlockBtn(false);
          this.movements = res.data;
        }
      },
      (err) => console.log(err));
  }

  getPaginated() {
    this._movements.getPaginated(this.pag.pageNro, this.pag.pageSize).subscribe(
      (res: Movements[] | any) => {
        if (!res.ok || res.data.length === 0) {
          this._pag.setBlockBtn(true);
        } else {
          this._pag.setBlockBtn(false);
          this.movements = res.data;
        }
      },
      (err) => console.log(err));
  }

  getMovement() {
    this._movements.get(this.movementSelected.id).subscribe(
      (res: Movements[] | any) => {
        if (res.ok)
          this.movementSelected = res.data;
      },
      (err) => console.log(err));
  }

  changeState(movementId, state) {

    let msg = {
      title: state === "a"
        ? "¿Mover a movimientos ANULADOS?"
        : state === "p"
          ? "¿Mover a movimientos PENDIENTES?"
          : "¿Mover a movimientos COMPLETADOS?",

      text: state === "a"
        ? "El movimiento no se eliminará, solo dejará impactar en las estadísticas."
        : state === "p"
          ? "El movimiento pasa a estar pendiente de finalización."
          : "El movimiento pasa a estar completado.",
    }

    this._toast.sweetConfirm(msg.title, msg.text)
      .then(res => {
        if (res)
          this._movements.changeState(movementId, state).subscribe(
            (res) => {
              this.getPaginated()
            },
            (err) => console.log(err));

      })
      .catch(err => console.log(err))
  }

}
