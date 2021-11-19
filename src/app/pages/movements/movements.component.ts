import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Clients } from 'src/app/models/Clients.model';
import { Movements } from 'src/app/models/Movements.model';
import { Payments } from 'src/app/models/Payments.model';
import { Products } from 'src/app/models/Products.model';
import { QueryPaginator } from 'src/app/models/QueryPaginator';
import { DataSourceService } from 'src/app/services/data.source.service';
import { MovementsService } from 'src/app/services/movements.service';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toasts.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { icons } from 'src/assets/icons';
import { PrintMovementService } from 'src/app/services/print-movement.service';
dayjs.extend(utc);

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.scss'],
})
export class MovementsComponent implements OnInit {
  pag = new QueryPaginator();
  movement: Movements = new Movements();
  movements: Movements[] = [];
  products: Movements[] = [];
  foundProduct: Products = null;
  client: Observable<Clients>;
  payment: Payments = {};

  attribute: string = 'nombre';
  text: string = '';
  title: string = 'Ventas';
  eanCode: string;
  salesType: string = 'EFECTIVO';
  commentary: string = '';

  quantity: number = null;
  totalOfSale: number = null;
  discount: number = null;
  delivery: number = null;

  isDiscountAvailable: boolean = false;
  isCurrentAccount: boolean = false;
  showDescription: boolean = false;
  showFilter: boolean = false;

  constructor(
    private _movements: MovementsService,
    private _products: ProductsService,
    public _dataSource: DataSourceService,
    private _toast: ToastService,
    private _print: PrintMovementService
  ) {
    this.checkStateMovement();
  }

  ngOnInit(): void {
    document.getElementById('eanCode').focus();
  }

  thereIsStock(): Promise<boolean> {
    return new Promise((resolve) => {
      this.quantity > this.foundProduct.stock_actual
        ? resolve(false)
        : resolve(true);
    });
  }

  applyDiscountChange() {
    this.isDiscountAvailable = !this.isDiscountAvailable;
    this.calculateTotal();
  }

  calculateTotal() {
    let total = 0;
    this.movement?.movimiento_lineas?.map((p) => {
      total += p.cantidad * p.precio_venta;
    });

    this.isDiscountAvailable
      ? (this.totalOfSale = total - this.discount)
      : (this.totalOfSale = total);

    this.checkStateMovement();
    this.calculateBalance();
  }

  calculateBalance() {
    this.movement.estado === 'PENDIENTE'
      ? (this.movement.saldo = this.totalOfSale - this.delivery)
      : (this.movement.saldo = null);
  }

  reset() {
    this.foundProduct = null;
    this.quantity = null;
    this.eanCode = '';
    document.getElementById('eanCode').focus();
  }

  clean() {
    this.movement = <Movements>{};
    this._dataSource.simpleObject = null;
    this.quantity = null;
    this.totalOfSale = null;
    this.discount = null;
    this.delivery = null;
  }

  /**
   * *************************
   * User interactions
   * *************************
   */
  async addProductToMovement() {
    this.movement.movimiento_lineas.push({
      id_producto: this.foundProduct.id,
      cantidad: this.quantity,
      unidad: 1,
      img: 'url/image.png',
      nombre: this.foundProduct.nombre,
      descripcion: this.foundProduct.descripcion,
      precio_venta: this.foundProduct.precio_venta,
      precio_oferta: this.foundProduct.rebaja,
      oferta: false,
    });

    this.calculateTotal();
    this.reset();
  }

  showHideDescription(state = null) {
    state
      ? (this.showDescription = state)
      : (this.showDescription = !this.showDescription);
  }

  showHideFilter(state = null) {
    state
      ? (this.showDescription = state)
      : (this.showDescription = !this.showDescription);
  }

  changeStateMovement(state) {
    this.movement.estado = state;
    this.calculateTotal();
  }

  deleteProduct(prod) {
    const index = this.movement.movimiento_lineas.findIndex(
      (p) => p.id_producto === prod.id_producto
    );
    this.movement.movimiento_lineas.splice(index, 1);
    this.calculateTotal();
  }

  setProduct(prod?: Products) {
    this.foundProduct = prod;
    document.getElementById('quantity').focus();
  }

  /**
   * *************************
   * Petitions
   * *************************
   */
  getProductByEanCode() {
    this._products.getByEanCode(this.eanCode).subscribe(
      (data: any) => {
        if (data.data.length === 0)
          return this._toast.toastError('No se encontró el artículo', '');
        else if (data.data.id) {
          this.setProduct(data.data);
          this.quantity = 1;
          document.getElementById('quantity').focus();
        }
      },
      (error) => {
        this._toast.toastError('Ocurrió un error.', '');
        console.log(error);
      }
    );
  }

  getPaginatedByTxt() {
    this.pag.pageNro = 0;
    this.pag.pageSize = 40;
    this._products
      .getPaginatedAndFilter(
        this.pag.pageNro,
        this.pag.pageSize,
        this.attribute,
        this.text
      )
      .subscribe(
        (data: any) => (this.products = data.data),
        (error) => {
          this._toast.toastError('Ocurrió un error.', '');
          console.log(error);
        }
      );
  }

  post() {
    this.movement.total = this.totalOfSale;
    this.movement.comentario = this.commentary;
    this.movement.modo_pago = this.salesType;
    this.movement.cliente = this._dataSource.simpleObject;
    this.movement.pagos = [];
    this.movement.fecha = dayjs(new Date()).format('YYYY-MM-DD');
    this.movement.hora = dayjs(new Date()).format('HH:mm:ss');

    if (this.delivery)
      this.movement.pagos.push({
        monto: this.delivery,
        fecha: dayjs(new Date()).format('YYYY-MM-DD'),
        hora: dayjs(new Date()).format('HH:mm:ss'),
      });

    this._toast
      .sweetConfirm('¿Confirmar movimiento?', '')
      .then((res) => {
        if (res)
          this._movements.post(this.movement).subscribe(
            (movement: any) => {
              if (movement.ok) {
                // this._toast.sweetSuccess('¡Movimiento cargado!', '');
                this._toast
                  .sweetConfirm('¿Desea imprimir el movimiento?', '')
                  .then((res) => {
                    if (res) {
                      this._print.generatePdf('print', movement.data);
                    }
                    setTimeout(() => {
                      this.clean();
                    }, 3000);
                  });
              } else {
                this._toast.toastError(
                  'Ocurrió un error.',
                  movement.userMessage
                );
              }
            },
            (error) => {
              this._toast.toastError('Ocurrió un error.', '');
              console.log(error);
            }
          );
      })
      .catch((err) => console.log(err));
  }

  /**
   * *************************
   * Validations
   * *************************
   */
  async validateProductToPush() {
    if (!this.foundProduct)
      return this._toast.toastError('No se encontró el artículo', '');

    if (
      this.quantity === 0 ||
      this.quantity === undefined ||
      !this.quantity ||
      typeof this.quantity === 'string'
    )
      return this._toast.toastAlert('Ingrese la cantidad', '');

    // iniciamos el array de lineas
    if (!this.movement.movimiento_lineas) this.movement.movimiento_lineas = [];
    // comprobamos que el producto no se encuentre ya cargado
    else if (
      this.movement.movimiento_lineas.some(
        (prod) => prod.id_producto === this.foundProduct.id
      )
    )
      return this._toast.toastAlert('Producto ya cargado', '');

    if (!(await this.thereIsStock()))
      return this._toast.toastAlert('No hay stock suficiente', '');

    this.addProductToMovement();
  }

  isValidMovement() {
    this.movement.cliente = this._dataSource.simpleObject;

    if (
      !this.movement.movimiento_lineas ||
      this.movement.movimiento_lineas.length === 0
    )
      return this._toast.toastAlert('Cargue al menos un producto', '');
    else if (
      this.movement?.cliente === undefined ||
      this.movement?.cliente === null
    )
      return this._toast.toastAlert('Cargue el cliente', '');
    else if (Object.entries(this.movement?.cliente).length === 0)
      return this._toast.toastAlert('Cargue el cliente', '');
    else if (
      this.salesType === 'CTACTE' &&
      (this.delivery === null || this.delivery === undefined)
    )
      return this._toast.toastAlert('Complete el monto de la entrega', '');
    else if (this.salesType === 'CTACTE' && this.delivery > this.totalOfSale)
      return this._toast.toastAlert(
        'La entrega no puede ser mayor al total',
        ''
      );
    else if (
      (this.isDiscountAvailable && !this.discount) ||
      this.discount === 0
    )
      return this._toast.toastAlert('Complete el descuento', '');
    else if (
      (this.isDiscountAvailable && !this.discount) ||
      this.discount === 0
    )
      return this._toast.toastAlert('Complete el descuento', '');
    else this.post();
  }

  validateNumberInput(input) {
    return typeof input === 'number' ? true : false;
  }

  /**
   * *************************
   * Checks
   * *************************
   */
  checkStateMovement() {
    this.salesType === 'CTACTE'
      ? (this.movement.estado = 'PENDIENTE')
      : (this.movement.estado = 'COMPLETADO');
  }

  checkSalesType() {
    if (this.salesType === 'CTACTE') {
      this.movement.estado = 'PENDIENTE';
      this.movement.pagos = [];
    } else {
      this.movement.estado = 'COMPLETADO';
    }

    this.calculateBalance();
  }
}
