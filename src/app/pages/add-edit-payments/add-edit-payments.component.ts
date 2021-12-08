import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toasts.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { Movements } from 'src/app/models/Movements.model';
import { DatesService } from 'src/app/services/dates.service';

@Component({
  selector: 'app-add-edit-payments',
  templateUrl: './add-edit-payments.component.html',
  styleUrls: ['./add-edit-payments.component.scss'],
})
export class AddEditPaymentsComponent implements OnInit {
  paymentForm: FormGroup;
  @Input('movementSelected')
  movementSelected: Movements = <Movements>{};
  @Output()
  getMovement: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private _payments: PaymentsService,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _date: DatesService
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

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

  postPayment() {
    let max = this.movementSelected.pagos.reduce((prev, current) => {
      return prev.pago_nro > current.pago_nro ? prev : current;
    }).pago_nro;
    max++;

    this.paymentForm.controls['movimientoId'].setValue(
      this.movementSelected.id
    );
    this.paymentForm.controls['pago_nro'].setValue(max);

    this._toast
      .sweetConfirm('¿Confirmar pago?', '')
      .then((res) => {
        if (res)
          this._payments.post(this.paymentForm.value).subscribe(
            (res) => {
              this._toast.sweetAlert('¡Pago agregado!', '');
              this.getMovement.emit();
              this.cleanForm();
            },
            (err) => console.log(err)
          );
      })
      .catch((err) => console.log(err));
  }

  cleanForm() {
    this.paymentForm.reset();
  }

  createForm() {
    this.paymentForm = this._fb.group({
      id: [''],
      pago_nro: [''],
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
}
