import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

const TABS = [
  { id: "productos", name: "Productos" },
  { id: "categorias", name: "Categorías" },
  { id: "marcas", name: "Marcas" },
  { id: "talles", name: "Talles" },
  { id: "proveedores", name: "Proveedores" }
]

@Component({
  selector: "app-products",
  templateUrl: "./products.page.html",
  styleUrls: ["./products.page.scss"],
})
export class ProductsPage implements OnInit {

  title: string = "Productos";
  tabName: string = "";
  tabList: any[] = TABS;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
  ) {

  }

  ngOnInit() {    
    // ejecutamos el evento
    this.setTabaName();
  }


  setTabaName(value?: string) {
    value
      ? this.tabName = value
      : this.tabName = "Productos";

    const tab = this.tabList.find(tab => tab.name === this.tabName).id;
    this._router.navigate([`/productos/tab-${tab}`], { relativeTo: this._route, skipLocationChange: false })
  }

}
