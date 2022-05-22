import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { PaginacionService } from 'src/app/components/paginacion/paginacion.service'
import { Products } from 'src/app/models/Products.model'
import { QueryPaginator } from 'src/app/models/QueryPaginator'
import { DataSourceService } from 'src/app/services/data.source.service'
import { TabsServices } from 'src/app/services/tabs.service'
import { ProductsService } from 'src/app/services/products.service'
import { HttpEventType } from '@angular/common/http'
import { FileUploadService } from 'src/app/services/file-upload.service'
import { ToastService } from 'src/app/services/toasts.service'
import { icons } from 'src/assets/icons'
import { ProvidersService } from 'src/app/services/providers.service'
import { BrandsService } from 'src/app/services/brands.service'
import { CategoriesService } from 'src/app/services/categories.service'
import { Providers } from 'src/app/models/Providers.model'
import { Brands } from 'src/app/models/Brands.model'
import { Categories } from 'src/app/models/Categories.model'

const ATTR_LIST = [
    'nombre',
    'descripcion',
    'precio_costo',
    'precio_venta',
    'sku',
    'ean',
    'stock_actual',
    'archivado',
    'proveedor',
    'marca',
    'categoria_uno',
]

@Component({
    selector: 'app-tab-products',
    templateUrl: './tab-products.component.html',
    styleUrls: ['./tab-products.component.scss'],
})
export class TabProductsComponent implements OnInit {
    formData: FormData
    csvFile: File
    progreso: string = ''
    showLoading: boolean = false
    // Filters atributes
    attr_selected: string = ATTR_LIST[0]
    attr_list: string[] = ATTR_LIST
    // Flag rol active
    isArchive: boolean = true
    // Search filter input
    searchText: string = ''
    isFiltering: boolean = false
    id_filter_list: number = null

    showTable$: Observable<boolean>
    products: any[] = []
    productos: any[] = []
    pag = new QueryPaginator()

    categories: Categories[] = []
    providers: Providers[] = []
    brands: Brands[] = []

    constructor(
        private _products: ProductsService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _pag: PaginacionService,
        private _dataSource: DataSourceService,
        private _tabs: TabsServices,
        private _fileUpload: FileUploadService,
        private _toast: ToastService,
        private _categories: CategoriesService,
        private _brands: BrandsService,
        private _providers: ProvidersService
    ) {
        this.showTable$ = this._tabs.observerShowTable()
        this._tabs.setShowTable(true)
    }

    ngOnInit() {}

    removeFilter() {
        this.isFiltering = false
        this.reset()
    }

    applyFilter() {
        // this._pag.setPag(0);
        this.isFiltering = true
        this.pag.pageNro = 0
        this.pag.attribute = this.attr_selected
        this.pag.text = this.searchText
        this.pag.isActive = this.isArchive
        this.getFiltered()
    }

    checkAttrSelected() {
        this.attr_selected === 'categoria_uno'
            ? this.getCategories()
            : this.attr_selected === 'marca'
            ? this.getBrands()
            : this.attr_selected === 'proveedor'
            ? this.getProviders()
            : null
    }

    pageChanged(event: { pageNro: number; pageSize: number }) {
        this.pag.pageNro = event.pageNro
        this.pag.pageSize = event.pageSize
        this.isFiltering ? this.getFiltered() : this.getPaginated()
    }

    goTo(product?) {
        this._dataSource.simpleObject = product
        this._router
            .navigate([`add-edit-productos`], {
                relativeTo: this._route,
                skipLocationChange: false,
            })
            .then(() => this._tabs.setShowTable(false))
    }

    reset(event?: any) {
        this._pag.setPag(0)
        this.isFiltering ? this.getFiltered() : this.getPaginated()
    }

    seeProduct(product: number) {
        // abrir modal con prod
    }

    getFiltered() {
        if (
            this.attr_selected === 'categoria_uno' ||
            this.attr_selected === 'marca' ||
            this.attr_selected === 'proveedor'
        ) {
            this.getPaginatedByIdOfAList()
        } else if (this.attr_selected === 'archivado') {
            this.getPaginatedByState()
        } else {
            this.getPaginatedAndFilter()
        }
    }

    getPaginated() {
        this._products
            .getPaginated(this.pag.pageNro, this.pag.pageSize)
            .subscribe(
                (res: Products[] | any) => this.setData(res),
                (err) => console.log(err)
            )
    }

    getPaginatedByIdOfAList() {
        if (this.id_filter_list === null)
            return this._toast.toastAlert('Seleccione un valor', '')

        this._products
            .getPaginatedByIdOfAList(
                this.pag.pageNro,
                this.pag.pageSize,
                this.pag.attribute,
                this.id_filter_list
            )
            .subscribe(
                (res: Products[] | any) => this.setData(res),
                (err) => console.log(err)
            )
    }

    getPaginatedByState() {
        this._products
            .getPaginatedByState(
                this.pag.pageNro,
                this.pag.pageSize,
                this.isArchive
            )
            .subscribe(
                (res: Products[] | any) => this.setData(res),
                (err) => console.log(err)
            )
    }

    getPaginatedAndFilter() {
        if (this.pag.text === '')
            return this._toast.toastAlert(
                'Ingrese una palabra para filtrar',
                ''
            )

        this._products
            .getPaginatedAndFilter(
                this.pag.pageNro,
                this.pag.pageSize,
                this.pag.attribute,
                this.pag.text
            )
            .subscribe(
                (res: Products[] | any) => this.setData(res),
                (err) => console.log(err)
            )
    }

    setData(res) {
        this.products = []
        this.products = res.data
        if (!res.ok)
            return this._toast.toastError('Intente nuevamente', 'Error')
        else if (res.data.length === 0) {
            this._pag.setBlockBtn(true)
            return this._toast.toastAlert('No se encontraron productos', '')
        } else return this._pag.setBlockBtn(false)
    }

    onUploadFile(event) {
        this.csvFile = <File>event.target.files[0]
        // console.log(this.csvFile.name);

        this.formData = new FormData()
        this.formData.append('file', this.csvFile, this.csvFile.name)
    }

    uploadCsv() {
        this._fileUpload.onUploadCsv(this.formData).subscribe(
            (event) => {
                if (event.type === HttpEventType.UploadProgress) {
                    // seguimiento del progreso
                    console.log(
                        'Progreso:' +
                            Math.round((event.loaded / event.total) * 100) +
                            '%'
                    )
                    this.progreso =
                        'Progreso:' +
                        Math.round((event.loaded / event.total) * 100) +
                        '%'
                } else if (event.type === HttpEventType.Response) {
                    if (event.status == 200) {
                        this.productos = event.body
                        this._toast.toastSuccess(
                            '¡Archivo agregado con éxito!',
                            ''
                        )
                        this.getPaginated()
                    }
                }
            },
            (err) => {
                this._toast.toastError('Intente nuevamente', 'Error')
                console.log(err)
            }
        )
    }

    /** Obtención de datos  */
    getProviders() {
        this._providers
            .getAll()
            .subscribe((res: Providers[]) => (this.providers = res['data']))
    }

    getBrands() {
        this._brands
            .getAll()
            .subscribe((res: Brands[]) => (this.brands = res['data']))
    }

    getCategories() {
        this._categories
            .getAll()
            .subscribe((res: Categories[]) => (this.categories = res['data']))
    }
}
