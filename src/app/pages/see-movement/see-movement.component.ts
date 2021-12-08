import { Component, Input, OnInit } from '@angular/core';
import { Movements } from 'src/app/models/Movements.model';
import { MovementsService } from 'src/app/services/movements.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { PrintMovementService } from 'src/app/services/print-movement.service';
import { ToastService } from 'src/app/services/toasts.service';

@Component({
  selector: 'app-see-movement',
  templateUrl: './see-movement.component.html',
  styleUrls: ['./see-movement.component.scss'],
})
export class SeeMovementComponent implements OnInit {
  @Input('selectedMovement') movementSelected: Movements;

  constructor(
    private _print: PrintMovementService,
    private _movements: MovementsService,
    private _toast: ToastService,
    private _payments: PaymentsService
  ) {}

  ngOnInit(): void {}

  generatePdf(action: string = 'open') {
    this._print.generatePdf(action, this.movementSelected);
  }

  deletePayment(payment) {
    const pay = { ...payment };
    pay.movimiento = this.movementSelected.id;
    this._toast
      .sweetConfirm(
        '¿Eliminar pago?',
        'Una vez eliminado no se podrá recuperar.'
      )
      .then((res) => {
        if (res)
          this._payments.delete(pay).subscribe({
            next: (res) => {
              this._toast.sweetAlert('¡Pago eliminado!', '');
              this.getMovement();
              // this.getMovements();
            },
            error: (err) => console.log(err),
          });
      })
      .catch((err) => console.log(err));
  }

  getMovement() {
    this._movements.get(this.movementSelected.id).subscribe({
      next: (res: Movements | any) => {
        if (res.ok) this.movementSelected = res.data[0];
      },
      error: (err) => this._toast.toastError('', ''),
    });
  }
}
