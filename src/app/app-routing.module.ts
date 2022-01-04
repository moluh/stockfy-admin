import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProductsPage } from './pages/products/products.page';
import { UsersPage } from './pages/users/users.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';

import { CanActivateService } from './services/auth/can-activate.service';
import { AddEditProductsPage } from './pages/add-edit-products/add-edit-products.page';
import { AddEditCategoriesComponent } from './pages/add-edit-categories/add-edit-categories.component';
import { TabProductsComponent } from './pages/tab-products/tab-products.component';
import { TabCategoriesComponent } from './pages/tab-categories/tab-categories.component';
import { TabBrandsComponent } from './pages/tab-brands/tab-brands.component';
import { AddEditBrandsComponent } from './pages/add-edit-brands/add-edit-brands.component';
import { AddEditProvidersComponent } from './pages/add-edit-providers/add-edit-providers.component';
import { TabProvidersComponent } from './pages/tab-providers/tab-providers.component';
import { TabUsersComponent } from './pages/tab-users/tab-users.component';
import { AddEditUsersComponent } from './pages/add-edit-users/add-edit-users.component';
import { MovementsComponent } from './pages/movements/movements.component';
import { MovementsListComponent } from './pages/movements-list/movements-list.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { ConfigurationsComponent } from './pages/configurations/configurations.component';
import { AddEditSizesComponent } from './pages/add-edit-sizes/add-edit-sizes.component';
import { TabSizesComponent } from './pages/tab-sizes/tab-sizes.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { AddEditExpensesComponent } from './pages/add-edit-expenses/add-edit-expenses.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [CanActivateService],
  },
  {
    path: 'ventas',
    component: MovementsComponent,
    canActivate: [CanActivateService],
  },
  {
    path: 'gastos',
    component: ExpensesComponent,
    canActivate: [CanActivateService],
    children: [
      {
        path: 'add-edit-expenses',
        component: AddEditExpensesComponent,
      },
    ],
  },
  {
    path: 'productos',
    component: TabProductsComponent,
    canActivate: [CanActivateService],
    children: [
      {
        path: 'add-edit-productos',
        component: AddEditProductsPage,
      },
    ],
  },
  {
    path: 'categorias',
    component: TabCategoriesComponent,
    canActivate: [CanActivateService],
    children: [
      {
        path: 'add-edit-categorias',
        component: AddEditCategoriesComponent,
      },
    ],
  },
  {
    path: 'marcas',
    component: TabBrandsComponent,
    canActivate: [CanActivateService],
    children: [
      {
        path: 'add-edit-marcas',
        component: AddEditBrandsComponent,
      },
    ],
  },
  {
    path: 'talles',
    component: TabSizesComponent,
    canActivate: [CanActivateService],
    children: [
      {
        path: 'add-edit-talles',
        component: AddEditSizesComponent,
      },
    ],
  },
  {
    path: 'proveedores',
    component: TabProvidersComponent,
    canActivate: [CanActivateService],
    children: [
      {
        path: 'add-edit-proveedores',
        component: AddEditProvidersComponent,
      },
    ],
  },
  {
    path: 'usuarios',
    component: UsersPage,
    canActivate: [CanActivateService],
    children: [
      {
        path: 'tab-usuarios',
        component: TabUsersComponent,
        canActivate: [CanActivateService],
        children: [
          {
            path: 'add-edit-usuarios',
            component: AddEditUsersComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'movimientos-lista',
    component: MovementsListComponent,
    canActivate: [CanActivateService],
  },
  {
    path: 'estadisticas',
    component: StatisticsComponent,
    canActivate: [CanActivateService],
  },
  {
    path: 'configuraciones',
    component: ConfigurationsComponent,
    canActivate: [CanActivateService],
  },

  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      initialNavigation: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
