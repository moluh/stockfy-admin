import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { PaginacionService } from 'src/app/components/paginacion/paginacion.service';
import { Clients } from 'src/app/models/Clients.model';
import { Movements } from 'src/app/models/Movements.model';
import { QueryPaginator } from 'src/app/models/QueryPaginator';
import { ClientsService } from 'src/app/services/clients.service';
import { DatesService } from 'src/app/services/dates.service';
import { MovementsService } from 'src/app/services/movements.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { ToastService } from 'src/app/services/toasts.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

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
  clients: Clients[] = [];
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
    private _clients: ClientsService,
    private _pag: PaginacionService
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
          this._payments.delete(payment).subscribe(
            (res) => {
              this._toast.sweetAlert('¡Pago eliminado!', '');
              this.getMovement();
              this.getMovements();
            },
            (err) => console.log(err)
          );
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
    this._movements.get(this.movementSelected.id).subscribe(
      (res: Movements[] | any) => {
        if (res.ok) this.movementSelected = res.data;
      },
      (err) => console.log(err)
    );
  }

  changeState(movementId, state) {
    let msg = {
      title:
        state === 'a'
          ? '¿Mover a movimientos ANULADOS?'
          : state === 'p'
          ? '¿Mover a movimientos PENDIENTES?'
          : '¿Mover a movimientos COMPLETADOS?',

      text:
        state === 'a'
          ? 'El movimiento no se eliminará, solo dejará impactar en las estadísticas.'
          : state === 'p'
          ? 'El movimiento pasa a estar pendiente de finalización.'
          : 'El movimiento pasa a estar completado.',
    };

    this._toast
      .sweetConfirm(msg.title, msg.text)
      .then((res) => {
        if (res)
          this._movements.changeState(movementId, state).subscribe(
            (res) => {
              this.getMovements();
            },
            (err) => console.log(err)
          );
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
    this._clients.getAll();
  }

  setData(res) {
    if (!res.ok || res.data.length === 0) {
      this._pag.setBlockBtn(true);
      this.movements = [];
    } else if (!Array.isArray(res.data)) {
      this._pag.setBlockBtn(false);
      this.movements = Array.from([res.data]);
    } else {
      this._pag.setBlockBtn(false);
      this.movements = res.data;
    }
  }

  getDocumentDefinition() {
    return {
      content: [
        {
          text: 'Datos del movimiento',
          style: 'header',
        },

        {
          //  layout: 'noBorders',
          table: {
            headerRows: 0,
            widths: ['25%', '70%'],
            body: [
              [
                { text: 'ID', style: 'detailDescription' },
                {
                  text: `${this.movementSelected.id}`,
                  style: 'detailDescription',
                },
              ],
              [
                { text: 'Fecha/Hora ', style: 'detailDescription' },
                {
                  text: `${dayjs(this.movementSelected.fecha).format('DD-MM-YYYY')} ${this.movementSelected.hora}`,
                  style: 'detailDescription',
                },
              ],
              [
                { text: 'Cliente', style: 'detailDescription' },
                {
                  text: `${this.movementSelected.cliente.nombre} ${this.movementSelected.cliente.apellido}`,
                  style: 'detailDescription',
                },
              ],
              [
                { text: 'Estado', style: 'detailDescription' },
                {
                  text: `${
                    this.movementSelected.estado === 'c'
                      ? 'COMPLETADO'
                      : this.movementSelected.estado === 'p'
                      ? 'PENDIENTE'
                      : 'ANULADO'
                  }`,
                  style: 'detailDescription',
                },
              ],
              [
                { text: 'Total', style: 'detailDescription' },
                {
                  text: `$ ${this.movementSelected.total.toFixed(2)}`,
                  style: 'detailDescription',
                },
              ],
              [
                { text: 'Saldo', style: 'detailDescription' },
                {
                  text: `${
                    this.movementSelected.saldo !== null
                      ? `$${this.movementSelected.saldo.toFixed(2)}`
                      : '-'
                  }`,
                  style: 'detailDescription',
                },
              ],
              [
                { text: 'Modo de pago', style: 'detailDescription' },
                {
                  text: `${
                    this.movementSelected.modo_pago === 'ctacte'
                      ? 'CUENTA CORRIENTE'
                      : this.movementSelected.modo_pago === 'efectivo'
                      ? 'EFECTIVO'
                      : 'TARJETA'
                  }`,
                  style: 'detailDescription',
                },
              ],
            ],
          },
        },

        {
          text: 'Productos',
          style: 'header',
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '55%', 'auto', '15%', '15%'],
            body: [
              [
                {
                  text: 'ID',
                  style: 'tableHeader',
                },
                {
                  text: 'Título',
                  style: 'tableHeader',
                },
                {
                  text: 'Cant.',
                  style: 'tableHeader',
                },
                {
                  text: 'Precio',
                  style: 'tableHeader',
                },
                {
                  text: 'Sub Total',
                  style: 'tableHeader',
                },
              ],
              ...this.movementSelected.movimiento_lineas.map((p) => {
                return [
                  { text: p.id_producto, style: 'tableDescription' },
                  { text: p.nombre, style: 'tableDescription' },
                  { text: p.cantidad, style: 'tableDescription' },
                  {
                    text: `$${p.precio_venta.toFixed(2)}`,
                    style: 'tableDescription',
                  },
                  {
                    text: `$${(p.cantidad * p.precio_venta).toFixed(2)}`,
                    style: 'tableDescription',
                  },
                ];
              }),
            ],
          },
        },
        this.movementSelected.pagos.length > 0
          ? {
              text: 'Pagos',
              style: 'header',
            }
          : {
              text: '',
              style: 'header',
            },
        this.movementSelected.pagos.length > 0
          ? {
              table: {
                headerRows: 1,
                widths: ['auto', '23%', '23%', '23%', '23%'],
                body: [
                  [
                    {
                      text: 'ID',
                      style: 'tableHeader',
                    },
                    {
                      text: 'Monto',
                      style: 'tableHeader',
                    },
                    {
                      text: 'Fecha',
                      style: 'tableHeader',
                    },
                    {
                      text: 'Interés',
                      style: 'tableHeader',
                    },
                    {
                      text: 'Ganancia',
                      style: 'tableHeader',
                    },
                  ],
                  ...this.movementSelected.pagos.map((p) => {
                    return [
                      { text: p.pago_nro, style: 'tableDescription' },
                      {
                        text: `$${p.monto.toFixed(2)}`,
                        style: 'tableDescription',
                      },
                      { text: dayjs(p.fecha).format('DD-MM-YYYY'), style: 'tableDescription' },
                      { text: `%${p.tasa_interes}`, style: 'tableDescription' },
                      {
                        text: `$${p.ganancia.toFixed(2)}`,
                        style: 'tableDescription',
                      },
                    ];
                  }),
                ],
              },
            }
          : '',
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 10, 0, 10],
          // decoration: 'underline',
          alignment: 'center',
        },
        tableHeader: {
          bold: true,
          alignment: 'center',
        },
        tableDescription: {
          alignment: 'center',
          margin: [0, 2, 0, 2],
        },
        detailDescription: {
          fontSize: 14,
          margin: [0, 2, 0, 2],
          alignment: 'center',
        },
      },
    };
  }

  generatePdf(action = 'open') {
    const documentDefinition = this.getDocumentDefinition();
    switch (action) {
      case 'open':
        pdfMake.createPdf(documentDefinition).open();
        break;
      case 'print':
        pdfMake.createPdf(documentDefinition).print();
        break;
      case 'download':
        pdfMake.createPdf(documentDefinition).download();
        break;
      default:
        pdfMake.createPdf(documentDefinition).open();
        break;
    }
  }
}
