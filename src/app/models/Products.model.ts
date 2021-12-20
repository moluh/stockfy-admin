import { Brands } from "./Brands.model";
import { Categories } from "./Categories.model";
import { Images } from "./Images.model";
import { Providers } from "./Providers.model";
import { Sizes } from "./Sizes.model";

export class Products {
  id?: number;
  nombre?: string;
  descripcion?: string;
  unidad?: number;
  alto?: number;
  ancho?: number;
  profundidad?: number;
  peso?: number;
  precio_costo?: number;
  precio_venta?: number;
  // disponible?: boolean;
  archivado?: boolean;
  rebaja?: number;
  sku?: string;
  ean?: string;
  stock_actual?: number;
  stock_infinito?: boolean;
  proveedor: Providers;
  marca: Brands;
  categoria_uno: Categories;
  categoria_dos: Categories;
  imagenes?: Images[];
  talles?: Sizes[];
}
