import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Brands } from 'src/app/models/Brands.model';
import { Categories } from 'src/app/models/Categories.model';
import { Products } from 'src/app/models/Products.model';
import { Providers } from 'src/app/models/Providers.model';
import { ApiService } from 'src/app/services/api.service';
import { BrandsService } from 'src/app/services/brands.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { DataSourceService } from 'src/app/services/data.source.service';
import { TabsServices } from 'src/app/services/tabs.service';
import { ProductsService } from 'src/app/services/products.service';
import { ProvidersService } from 'src/app/services/providers.service';
import { ToastService } from 'src/app/services/toasts.service';
import { SizesService } from 'src/app/services/sizes.service';
import { Sizes } from 'src/app/models/Sizes.model';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-add-edit-products',
  templateUrl: './add-edit-products.page.html',
  styleUrls: ['./add-edit-products.page.scss'],
})
export class AddEditProductsPage implements OnInit, AfterViewInit {
  isEditing: boolean = false;
  enableEdit: boolean = false;
  productForm: FormGroup;
  typeForm: string; // si edita o agrega uno nuevo
  categoriesArray: Categories[] = [];
  providers: Providers[] = [];
  brands: Brands[] = [];
  sizesArray: Sizes[] = [];
  hasSizes: boolean = false;
  hasSpecifications: boolean = false;
  hasCategories: boolean = false;
  hasBarCodes: boolean = false;
  @ViewChild('sku') private sku: ElementRef;
  @ViewChild('ean') private ean: ElementRef;

  constructor(
    private _fb: FormBuilder,
    private _brands: BrandsService,
    private _size: SizesService,
    private _providers: ProvidersService,
    private _products: ProductsService,
    private _categories: CategoriesService,
    private _router: Router,
    private _toast: ToastService,
    private _tabs: TabsServices,
    private _dataSource: DataSourceService,
    private _api: ApiService
  ) {
    this.createForm();
    this.enableDisable();
    this.getCategories();
    this.getBrands();
    this.getSizes();
    this.getProviders();
    this.fillDefaultValues();
  }

  ngOnInit() {
    /**
     * Comprobamos si viene un id, es porque modifica, sino, es uno nuevo.
     *
     * La variable typeForm tiene la funcionalidad de comprobar el tipo de formulario,
     * si es de edición, habilita el botón que puede deshabilitar los campos del formulario
     * o habilitarlos.
     *
     *  */
    if (this._dataSource.simpleObject?.id) {
      this.typeForm = 'edit';
      this.loadForm(this._dataSource.simpleObject);
    } else {
      this.typeForm = 'new';
    }
  }

  ngAfterViewInit() {
    let sku = 'SIN-CODIGOS';
    let ean = '1234567890128';
    if (this.typeForm === 'edit') {
      sku = this._dataSource.simpleObject.sku;
      ean = this._dataSource.simpleObject.ean;
      this.hasBarCodes = true;
    } else {
      this.hasBarCodes = false;
    }

    this.setBarCodes(sku, ean);
    // limpiamos la data del objeto del servicio
    this._dataSource.simpleObject = undefined;
  }

  setBarCodes(sku: string, ean: string) {
    let eanFormat = 'EAN' + ean.length;
    if (ean.length === 7 || ean.length === 8) eanFormat = 'EAN8';
    JsBarcode(this.sku.nativeElement, sku, {
      format: 'CODE128',
      width: 2,
    });

    JsBarcode(this.ean.nativeElement, ean, {
      format: eanFormat,
      width: 2,
    });
  }

  loadForm(product) {
    this.productForm.reset(product);

    this.productForm.setControl('talles', this._fb.array(product.talles));
    product.talles.length > 0
      ? (this.hasSizes = true)
      : (this.hasSizes = false);

    this.productForm.setControl(
      'categorias',
      this._fb.array(product.categorias)
    );
    product.categorias.length > 0
      ? (this.hasCategories = true)
      : (this.hasCategories = false);

    this.checkIfHasSpecifications();
  }

  checkIfHasSpecifications() {
    if (
      this._dataSource.simpleObject.alto !== null ||
      this._dataSource.simpleObject.ancho !== null ||
      this._dataSource.simpleObject.peso !== null ||
      this._dataSource.simpleObject.profundidad !== null
    )
      this.hasSpecifications = true;
    else this.hasSpecifications = false;
  }

  send() {
    this.productForm.get('id').value === '' ? this.post() : this.update();
  }

  update() {
    this._toast
      .sweetConfirm('Confirmar cambios', '¿Desea guardar los cambios?')
      .then((res) => {
        if (res)
          this._products.update(this.productForm.value).subscribe({
            next: (res: Products | any) => {
              this.isEditing = false;
              this._api.handleSuccess(res, '¡Guardado!', ``);
            },
            error: (err) => this._api.handleError(err, 'Ocurrió un error', ``),
          });
      });
  }

  post() {
    this._toast
      .sweetConfirm('Guardar', '¿Desea guardar el producto?')
      .then((res) => {
        if (res)
          this._products.post(this.productForm.value).subscribe({
            next: (res: Products | any) => {
              this.isEditing = false;
              this._api.handleSuccess(res, '¡Guardado!', ``);
              setTimeout(() => {
                this.productForm.reset();
                this._router
                  .navigate(['/productos/tab-productos'])
                  .then(() => this._tabs.setShowTable(true));
              }, 1500);
            },
            error: (err) => this._api.handleError(err, 'Ocurrió un error', ``),
          });
      });
  }

  enableDisable() {
    this.enableEdit
      ? Object.values(this.productForm.controls).forEach((control) => {
          //if (control.get('marca') === null)
          control.disable();
        })
      : Object.values(this.productForm.controls).forEach((control) => {
          //if (control.get('marca') === null)
          control.enable();
        });

    this.enableEdit = !this.enableEdit;
  }

  createForm() {
    this.productForm = this._fb.group({
      id: [''],
      nombre: ['', [Validators.required]],
      descripcion: [''],
      descripcion_html: [''],
      precio_costo: [],
      precio_venta: [null, [Validators.required]],
      rebaja: [],
      sku: [''],
      ean: [''],
      stock_actual: ['', [Validators.required]],
      stock_infinito: [false],
      unidad: [1],
      proveedor: this._fb.group({
        id: ['', [Validators.required]],
        proveedor: [''],
      }),
      marca: this._fb.group({ id: ['', [Validators.required]], marca: [''] }),
      // colores: this._fb.array([this._fb.control('')]),
      disponible: [true],
      archivado: [false],
      imagenes: this._fb.array([]),
      talles: this._fb.array([]),
      categorias: this._fb.array([]),
      alto: [],
      ancho: [],
      peso: [],
      profundidad: [],
    });
  }

  compareBrand(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2 : c1 === c2;
  }

  compareCategory(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2 : c1 === c2;
  }

  fillDefaultValues() {
    if ((this.typeForm = 'new')) {
      this.productForm.controls['marca'].get('id').setValue(1);
      this.productForm.controls['proveedor'].get('id').setValue(1);
    }
  }

  goTo() {
    this.isEditing
      ? this._toast
          .sweetConfirm(
            'Hay modificaciones sin guardar',
            '¿Descartar modificaciones?'
          )
          .then((res) => (res ? this.redirect() : null))
      : this.redirect();
  }

  redirect() {
    this._router
      .navigate(['/productos/tab-productos'])
      .then(() => this._tabs.setShowTable(true));
  }

  /**
   * Obtención de datos
   */
  getProviders() {
    this._providers
      .getAll()
      .subscribe((res: Providers[]) => (this.providers = res['data']));
  }

  getBrands() {
    this._brands
      .getAll()
      .subscribe((res: Brands[]) => (this.brands = res['data']));
  }

  getCategories() {
    this._categories
      .getAll()
      .subscribe((res: Categories[]) => (this.categoriesArray = res['data']));
  }

  getSizes() {
    this._size.getAll().subscribe((res: Sizes[]) => {
      this.sizesArray = res['data'];
    });
  }

  /**
   * Form controls status
   */
  get nameInvalid() {
    return (
      this.productForm.get('nombre').invalid &&
      this.productForm.get('nombre').touched
    );
  }

  get stockInvalid() {
    return (
      this.productForm.get('stock_actual').invalid &&
      this.productForm.get('stock_actual').touched
    );
  }

  get precioVentaInvalid() {
    return (
      this.productForm.get('precio_venta').invalid &&
      this.productForm.get('precio_venta').touched
    );
  }

  /**
   * Categories functions
   */
  get categorias() {
    return this.productForm.get('categorias') as FormArray;
  }

  addCategoriasToCategoriasFormArray(cat) {
    if (this.categorias.value.some((el) => el.id === cat.id))
      this._toast.toastAlert('Ya se encuentra agregada', '');
    else this.categorias.push(this._fb.control(cat));
  }

  removeCategoriaFromCategoriasFormArray(i) {
    this.categorias.removeAt(i);
  }

  /**
   * Sizes functions
   */
  get talles() {
    return this.productForm.get('talles') as FormArray;
  }

  addSizeToTallesFormArray(size) {
    /**
     * Ejemplo para carga de un array de formArray
     * res['data'].forEach(talle => { this.talles.push(this._fb.control(talle)) })
     * o tambien:
     * this.productForm.setControl('talles', this.fb.array(res['data']));
     */
    if (this.talles.value.some((el) => el.id === size.id))
      this._toast.toastAlert('Ya se encuentra agregado', '');
    else this.talles.push(this._fb.control(size));
  }

  removeSizeFromTallesFormArray(i) {
    this.talles.removeAt(i);
  }
}
