import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
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

@Component({
  selector: 'app-add-edit-products',
  templateUrl: './add-edit-products.page.html',
  styleUrls: ['./add-edit-products.page.scss'],
})
export class AddEditProductsPage implements OnInit {
  isEditing: boolean = false;
  enableEdit: boolean = false;
  productForm: FormGroup;
  typeForm: string; // si edita o agrega uno nuevo
  categories: Categories[] = [];
  providers: Providers[] = [];
  brands: Brands[] = [];
  sizesArray: Sizes[] = [];
  hasSizes: boolean = false;
  hasSpecifications: boolean = false;

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
    this.enableDisble();
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
      this.productForm.reset(this._dataSource.simpleObject);
      this.productForm.setControl(
        'talles',
        this._fb.array(this._dataSource.simpleObject.talles)
      );
      this._dataSource.simpleObject.talles.length > 0
        ? (this.hasSizes = true)
        : (this.hasSizes = false);
      this.checkIfHasSpecifications();
    } else {
      this.typeForm = 'new';
    }

    // limpiamos la data del objeto del servicio
    this._dataSource.simpleObject = undefined;
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

  update() {
    this._toast
      .sweetConfirm('Confirmar cambios', '¿Desea guardar los cambios?')
      .then((res) => {
        if (res)
          this._products.update(this.productForm.value).subscribe(
            (res: Products | any) => {
              this.isEditing = false;
              this._api.handleSuccess(res, '¡Guardado!', ``);
            },
            (err) => this._api.handleError(err, 'Ocurrió un error', ``)
          );
      });
  }

  post() {
    this._toast
      .sweetConfirm('Guardar', '¿Desea guardar el producto?')
      .then((res) => {
        if (res)
          this._products.post(this.productForm.value).subscribe(
            (res: Products | any) => {
              this.isEditing = false;
              this._api.handleSuccess(res, '¡Guardado!', ``);
            },
            (err) => this._api.handleError(err, 'Ocurrió un error', ``)
          );
      });
  }

  enableDisble() {
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
    this.productForm = this._fb.group(
      {
        id: [''],
        nombre: [''],
        precio_costo: [],
        precio_venta: [],
        sku: [''],
        stock_actual: ['', [Validators.required]],
        unidad: [1],
        proveedor: this._fb.group({
          id: ['', [Validators.required]],
          proveedor: [''],
        }),
        marca: this._fb.group({ id: ['', [Validators.required]], marca: [''] }),
        categoria_uno: this._fb.group({
          id: ['', [Validators.required]],
          categoria: [''],
        }),
        categoria_dos: this._fb.group({
          id: ['', [Validators.required]],
          categoria: [''],
        }),
        colores: this._fb.array([this._fb.control('')]),
        descripcion: [''],
        disponible: [true],
        archivado: [true],
        imagenes: this._fb.array([]),
        talles: this._fb.array([]),
        rebaja: [],
        alto: [],
        ancho: [],
        peso: [],
        profundidad: [],
      }
      // ,
      //   {
      //     validator: this._validator.samePasswords('pass1', 'pass2')
      //   } as AbstractControlOptions
    );
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
      this.productForm.controls['categoria_uno'].get('id').setValue(1);
      this.productForm.controls['categoria_dos'].get('id').setValue(1);
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

  /** Obtención de datos  */
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
      .subscribe((res: Categories[]) => (this.categories = res['data']));
  }

  getSizes() {
    this._size.getAll().subscribe((res: Sizes[]) => {
      this.sizesArray = res['data'];
    });
  }

  get talles() {
    return this.productForm.get('talles') as FormArray;
  }

  addSizeToTallesFormArray(size) {
    if (this.talles.value.some((el) => el.id === size.id))
      this._toast.toastAlert('Ya se encuentra agregado', '');
    else this.talles.push(this._fb.control(size));

    /**
     * Ejemplo para carga de un array de formArray
     * res['data'].forEach(talle => { this.talles.push(this._fb.control(talle)) })
     *
     * o tambien:
     * this.productForm.setControl('talles', this.fb.array(res['data']));
     *
     */
  }

  removeSizeFromTallesFormArray(i) {
    this.talles.removeAt(i);
  }

  send() {
    this.productForm.get('id').value === '' ? this.post() : this.update();
  }

  get nameInvalid() {
    return (
      this.productForm.get('nombre').invalid &&
      this.productForm.get('nombre').touched
    );
  }

  get descriptionInvalid() {
    return (
      this.productForm.get('descripcion').invalid &&
      this.productForm.get('descripcion').touched
    );
  }

  get stockInvalid() {
    return (
      this.productForm.get('stock_actual').invalid &&
      this.productForm.get('stock_actual').touched
    );
  }
}
