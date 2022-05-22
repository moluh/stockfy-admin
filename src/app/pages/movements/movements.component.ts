import { Component, OnDestroy, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { Movements } from 'src/app/models/Movements.model'
import { Payments } from 'src/app/models/Payments.model'
import { Products } from 'src/app/models/Products.model'
import { QueryPaginator } from 'src/app/models/QueryPaginator'
import { DataSourceService } from 'src/app/services/data.source.service'
import { MovementsService } from 'src/app/services/movements.service'
import { ProductsService } from 'src/app/services/products.service'
import { ToastService } from 'src/app/services/toasts.service'
import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import { PrintMovementService } from 'src/app/services/print-movement.service'
import { Users } from 'src/app/models/Users.model'
import { changeStateEditing } from 'src/app/store/actions/isEditing.action'
import { IsEditingService } from 'src/app/services/is-editing.service'
import { Editing } from 'src/app/interfaces/isEdting.interface'
dayjs.extend(utc)

@Component({
    selector: 'app-movements',
    templateUrl: './movements.component.html',
    styleUrls: ['./movements.component.scss'],
})
export class MovementsComponent implements OnInit, OnDestroy {
    pag = new QueryPaginator()
    movement: Movements = new Movements()
    movements: Movements[] = []
    products: Movements[] = []
    foundProduct: Products = null
    user: Observable<Users>
    payment: Payments = {}

    attribute: string = 'nombre'
    text: string = ''
    title: string = 'Ventas'
    barcode: string
    salesType: string = 'EFECTIVO'
    commentary: string = ''

    quantity: number = null
    totalOfSale: number = null
    discount: number = null
    delivery: number = null

    isDiscountAvailable: boolean = false
    isCurrentAccount: boolean = false
    showDescription: boolean = false
    showFilter: boolean = false
    isEditingForm: Editing = <Editing>{}

    constructor(
        private _movements: MovementsService,
        private _products: ProductsService,
        public _dataSource: DataSourceService,
        private _toast: ToastService,
        private _isEditing: IsEditingService,
        private _print: PrintMovementService,
        private store: Store<{ movement: number; isEditing: boolean }>
    ) {
        _dataSource.simpleObject = null
        this.checkStateMovement()
        this.isEditingForm = { isEditing: false, component: 'Movimientos' }
        _isEditing.setIsEditingForm(this.isEditingForm)
    }

    changeStateForm(isEditing: boolean) {
        this.store.dispatch(
            changeStateEditing({ isEditing, component: 'Movimientos' })
        )
    }

    ngOnInit(): void {
        document.getElementById('barcode').focus()
    }

    ngOnDestroy(): void {
        this.changeStateForm(false)
    }

    thereIsStock(): Promise<boolean> {
        return new Promise((resolve) => {
            if (this.foundProduct.stock_infinito) resolve(true)
            else {
                this.quantity > this.foundProduct.stock_actual
                    ? resolve(false)
                    : resolve(true)
            }
        })
    }

    applyDiscountChange() {
        this.isDiscountAvailable = !this.isDiscountAvailable
        this.calculateTotal()
    }

    calculateTotal() {
        let total = 0
        this.movement?.movimiento_lineas?.map((p) => {
            if (p.porcentaje !== 0) {
                total +=
                    p.cantidad * p.precio_venta +
                    p.precio_venta * (p.porcentaje / 100)
            } else total += p.cantidad * p.precio_venta
        })

        this.isDiscountAvailable
            ? (this.totalOfSale = total - this.discount)
            : (this.totalOfSale = total)

        this.checkStateMovement()
        this.calculateBalance()
    }

    calculateBalance() {
        this.movement.estado === 'PENDIENTE'
            ? (this.movement.saldo = this.totalOfSale - this.delivery)
            : (this.movement.saldo = null)
    }

    resetProduct() {
        this.foundProduct = null
        this.quantity = null
        this.barcode = ''
        document.getElementById('barcode').focus()
        this.changeStateForm(true)
    }

    clean() {
        this.movement = <Movements>{}
        this._dataSource.simpleObject = null
        this.quantity = null
        this.totalOfSale = null
        this.discount = null
        this.delivery = null
        this.changeStateForm(false)
    }

    /**
     * *************************
     * User interactions
     * *************************
     */

    async changePrice(idProduct: number, indexProduct: number) {
        const newPrice = await this._toast.sweetInput('Valor del producto:')

        const productToUpdate = this.movement.movimiento_lineas.find(
            (prod) => prod.id_producto === idProduct
        )

        if (/^\d+$/.test(newPrice)) {
            // check if it is a number
            productToUpdate.precio_venta = parseFloat(newPrice)
            this.calculateTotal()
        } else {
            this._toast.toastError('Ingrese un valor numérico', '')
        }
    }

    async applyPercentage(idProduct: number, indexProduct: number) {
        let percentage = await this._toast.sweetInput('Porcentaje:')
        const productToUpdate = this.movement.movimiento_lineas.find(
            (prod) => prod.id_producto === idProduct
        )

        if (/^-?\d*\.?\d+$/.test(percentage) && productToUpdate) {
            productToUpdate.porcentaje = parseFloat(percentage)
            this.calculateTotal()
        } else {
            this._toast.toastError('Ingrese un valor numérico', '')
        }
    }

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
            porcentaje: 0,
            oferta: false,
        })

        this.calculateTotal()
        this.resetProduct()
    }

    showHideDescription(state = null) {
        state
            ? (this.showDescription = state)
            : (this.showDescription = !this.showDescription)
    }

    showHideFilter(state = null) {
        state
            ? (this.showDescription = state)
            : (this.showDescription = !this.showDescription)
    }

    changeStateMovement(state) {
        this.movement.estado = state
        this.calculateTotal()
    }

    deleteProduct(prod) {
        const index = this.movement.movimiento_lineas.findIndex(
            (p) => p.id_producto === prod.id_producto
        )
        this.movement.movimiento_lineas.splice(index, 1)
        this.calculateTotal()
    }

    setProduct(prod?: Products) {
        this.foundProduct = prod
        document.getElementById('quantity').focus()
    }

    /**
     * *************************
     * Petitions
     * *************************
     */
    getProductByCode() {
        this._products.getByCodes(this.barcode).subscribe(
            (data: any) => {
                if (data.data.length === 0)
                    return this._toast.toastError(
                        'No se encontró el artículo',
                        ''
                    )
                else {
                    this.setProduct(data.data[0])
                    this.quantity = 1
                    document.getElementById('quantity').focus()
                }
            },
            (error) => {
                this._toast.toastError('Ocurrió un error.', '')
            }
        )
    }

    getPaginatedByTxt() {
        this.pag.pageNro = 0
        this.pag.pageSize = 40
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
                    this._toast.toastError('Ocurrió un error.', '')
                }
            )
    }

    post() {
        this.movement.total = this.totalOfSale
        this.movement.comentario = this.commentary
        this.movement.modo_pago = this.salesType
        this.movement.usuario = this._dataSource.simpleObject
        this.movement.pagos = []
        this.movement.fecha = dayjs(new Date()).format('YYYY-MM-DD')
        this.movement.hora = dayjs(new Date()).format('HH:mm:ss')

        if (this.delivery && this.salesType === 'CTACTE')
            this.movement.pagos.push({
                monto: this.delivery,
                fecha: dayjs(new Date()).format('YYYY-MM-DD'),
                hora: dayjs(new Date()).format('HH:mm:ss'),
            })

        this._toast
            .sweetConfirm('¿Confirmar movimiento?', '')
            .then((res) => {
                if (res)
                    this._movements.post(this.movement).subscribe(
                        (movement: any) => {
                            if (movement.ok) {
                                // this._toast.sweetSuccess('¡Movimiento cargado!', '');
                                this._toast
                                    .sweetConfirm(
                                        '¿Desea imprimir el movimiento?',
                                        ''
                                    )
                                    .then((res) => {
                                        if (res) {
                                            this._print.generatePdf(
                                                'print',
                                                movement.data[0]
                                            )
                                        }
                                    })
                                setTimeout(() => {
                                    this.clean()
                                }, 2000)
                            } else {
                                this._toast.toastError(
                                    'Ocurrió un error.',
                                    movement.userMessage
                                )
                            }
                        },
                        (error) => {
                            this._toast.toastError('Ocurrió un error.', '')
                            console.log(error)
                        }
                    )
            })
            .catch((err) => console.log(err))
    }

    /**
     * *************************
     * Validations
     * *************************
     */
    async validateProductToPush() {
        if (!this.foundProduct)
            return this._toast.toastError('No se encontró el artículo', '')

        if (this.quantity === 0 || !this.isNumber(this.quantity))
            return this._toast.toastAlert('Ingrese la cantidad', '')

        // iniciamos el array de lineas
        if (!this.movement.movimiento_lineas)
            this.movement.movimiento_lineas = []
        // comprobamos que el producto no se encuentre ya cargado
        else if (
            this.movement.movimiento_lineas.some(
                (prod) => prod.id_producto === this.foundProduct.id
            )
        )
            return this._toast.toastAlert('Producto ya cargado', '')

        if (!(await this.thereIsStock()))
            return this._toast.toastAlert('No hay stock suficiente', '')

        this.addProductToMovement()
    }

    isValidMovement() {
        this.movement.usuario = this._dataSource.simpleObject

        if (
            !this.movement.movimiento_lineas ||
            this.movement.movimiento_lineas.length === 0
        )
            return this._toast.toastAlert('Cargue al menos un producto', '')
        else if (
            this.movement?.usuario === undefined ||
            this.movement?.usuario === null
        )
            return this._toast.toastAlert('Cargue el usuario', '')
        else if (Object.entries(this.movement?.usuario).length === 0)
            return this._toast.toastAlert('Cargue el usuario', '')
        else if (
            this.salesType === 'CTACTE' &&
            (this.delivery === null || this.delivery === undefined)
        )
            return this._toast.toastAlert('Complete el monto de la entrega', '')
        else if (
            this.salesType === 'CTACTE' &&
            this.delivery > this.totalOfSale
        )
            return this._toast.toastAlert(
                'La entrega no puede ser mayor al total',
                ''
            )
        else if (
            (this.isDiscountAvailable && !this.discount) ||
            this.discount === 0
        )
            return this._toast.toastAlert('Complete el descuento', '')
        else if (
            (this.isDiscountAvailable && !this.discount) ||
            this.discount === 0
        )
            return this._toast.toastAlert('Complete el descuento', '')
        else this.post()
    }

    isNumber(input) {
        return /^\d+$/.test(input)
    }

    /**
     * *************************
     * Checks
     * *************************
     */
    checkStateMovement() {
        this.salesType === 'CTACTE'
            ? (this.movement.estado = 'PENDIENTE')
            : (this.movement.estado = 'COMPLETADO')
    }

    checkSalesType() {
        if (this.salesType === 'CTACTE') {
            this.movement.estado = 'PENDIENTE'
            this.movement.pagos = []
        } else {
            this.movement.estado = 'COMPLETADO'
        }

        this.calculateBalance()
    }
}
