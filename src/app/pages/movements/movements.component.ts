import { typeofExpr } from '@angular/compiler/src/output/output_ast';
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

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.scss']
})
export class MovementsComponent implements OnInit {

  pag = new QueryPaginator();
  attribute: string = "nombre";
  text: string = "";
  showFilter: boolean = false;
  title: string = "Ventas"
  eanCode: string;
  salesType: string = "efectivo";
  quantity: number = undefined;
  totalOfSale: number;
  movement: Movements = new Movements();
  movements: Movements[] = [];
  products: Movements[] = [];
  foundProduct: Products = undefined;
  client: Observable<Clients>
  discount: number = null;
  isDiscountAvailable: boolean = false;
  isCurrentAccount: boolean = false;
  commentary: string = "";
  delivery: number = null;
  payment: Payments = {}

  constructor(
    private _movements: MovementsService,
    private _products: ProductsService,
    public _dataSource: DataSourceService,
    private _toast: ToastService) {

    this.checkStateMovement()

  }

  ngOnInit(): void {
    document.getElementById("eanCode").focus();
  }

  checkSalesType() {
    if (this.salesType === 'ctacte') {
      this.movement.estado = 'p';
      this.movement.pagos = [];
    } else {
      this.movement.estado = 'c';
    }

    this.calculateBalance();
  }

  reset() {
    this.foundProduct = undefined
    this.quantity = undefined;
    this.eanCode = '';
    document.getElementById("eanCode").focus();
  }

  validateNumberInput(input) {
    return typeof input === 'number' ? true : false;
  }

  isValidMovement() {

    this.movement.cliente = this._dataSource.simpleObject;

    if (!this.movement.movimiento_lineas ||
      this.movement.movimiento_lineas.length === 0)
      return this._toast.toastAlert('Cargue al menos un producto', '');

    else if (this.movement?.cliente === undefined ||
      Object.entries(this.movement?.cliente).length === 0)
      return this._toast.toastAlert('Cargue el cliente', '');

    else if (this.salesType === "ctacte" && (this.delivery === null || this.delivery === undefined))
      return this._toast.toastAlert('Complete el monto de la entrega', '');

    else if (this.isDiscountAvailable &&
      !this.discount || this.discount === 0)
      return this._toast.toastAlert('Complete el descuento', '');

    else if (this.isDiscountAvailable &&
      !this.discount || this.discount === 0)
      return this._toast.toastAlert('Complete el descuento', '');

    else
      this.post();

  }

  applyDiscountChange() {
    this.isDiscountAvailable = !this.isDiscountAvailable;
    this.calculateTotal()
  }

  changeStateMovement(state) {
    this.movement.estado = state;
    this.calculateTotal()
  }

  checkStateMovement() {
    this.salesType === 'ctacte'
      ? this.movement.estado = 'p'
      : this.movement.estado = 'c'
  }

  calculateTotal() {
    let total = 0;
    this.movement?.movimiento_lineas?.map(p => {
      total += p.cantidad * p.precio_venta;
    });

    this.isDiscountAvailable
      ? this.totalOfSale = total - this.discount
      : this.totalOfSale = total

    this.checkStateMovement();
    this.calculateBalance()
  }

  calculateBalance() {
    this.movement.estado === 'p'
      ? this.movement.saldo = this.totalOfSale - this.delivery
      : this.movement.saldo = null;
  }

  setProduct(prod?: Products) {
    this.foundProduct = prod;
    document.getElementById("quantity").focus();
  }

  async validateProductToPush() {
    if (!this.foundProduct)
      return this._toast.toastError('No se encontró el artículo', '');

    if (this.quantity === 0 || this.quantity === undefined ||
      !this.quantity || typeof this.quantity === "string")
      return this._toast.toastAlert('Ingrese la cantidad', '');

    // iniciamos el array de lineas
    if (!this.movement.movimiento_lineas)
      this.movement.movimiento_lineas = [];

    // comprobamos que el producto no se encuentre ya cargado
    else if (this.movement.movimiento_lineas.some(prod => prod.id_producto === this.foundProduct.id))
      return this._toast.toastAlert('Producto ya cargado', '');

    if (!await this.thereIsStock())
      return this._toast.toastAlert('No hay stock suficiente', '');

    this.addProductToMovement()
  }

  async addProductToMovement() {

    this.movement.movimiento_lineas.push({
      id_producto: this.foundProduct.id,
      cantidad: this.quantity,
      unidad: 1,
      img: "string",
      nombre: this.foundProduct.nombre,
      descripcion: this.foundProduct.descripcion,
      precio_venta: this.foundProduct.precio_venta,
      precio_oferta: this.foundProduct.rebaja,
      oferta: false
    });

    this.calculateTotal()
    this.reset()
  }

  getProductByEanCode() {
    this._products.getByEanCode(this.eanCode).subscribe(
      (data: any) => {

        if (data.data.length === 0)
          return this._toast.toastError('No se encontró el artículo', '');
        else if (data.data.id) {
          this.setProduct(data.data);
          this.quantity = 1;
          document.getElementById("quantity").focus();
        }
      },
      error => {
        this._toast.toastError('Ocurrió un error.', ''); console.log(error);
      }
    )
  }

  getPaginatedByTxt() {
    this.pag.pageNro = 0;
    this.pag.pageSize = 20;
    this._products.getPaginatedAndFilter(
      this.pag.pageNro,
      this.pag.pageSize,
      this.attribute,
      this.text
    ).subscribe(
      (data: any) => this.products = data.data,
      error => {
        this._toast.toastError('Ocurrió un error.', ''); console.log(error);
      }
    )
  }

  post() {
    this.movement.total = this.totalOfSale;
    this.movement.comentario = this.commentary;
    this.movement.modo_pago = this.salesType;
    this.movement.cliente = this._dataSource.simpleObject;
    this.movement.pagos = []
    if (this.delivery)
      this.movement.pagos.push({ monto: this.delivery });


    this._toast.sweetConfirm("¿Confirmar venta?", "")
      .then(res => {
        if (res)
          this._movements.post(this.movement).subscribe(
            (res: any) => {
              if (res.ok) {
                this._toast.sweetSuccess('¡Movimiento cargado!', '');
                this.clean();
              } else {
                this._toast.toastError('Ocurrió un error.', res.userMessage);
              }
            },
            error => {
              this._toast.toastError('Ocurrió un error.', ''); console.log(error);
            }
          );
      })
      .catch(err => console.log(err))


  }

  clean() {
    this.movement = <Movements>{};
    this._dataSource.simpleObject = null;
  }

  deleteProduct(prod) {
    const index = this.movement.movimiento_lineas
      .findIndex(p => p.id_producto === prod.id_producto);
    this.movement.movimiento_lineas.splice(index, 1);
    this.calculateTotal()
  }

  thereIsStock(): Promise<boolean> {
    return new Promise((resolve) => {
      this.quantity > this.foundProduct.stock_actual
        ? resolve(false)
        : resolve(true);
    });
  }


}

