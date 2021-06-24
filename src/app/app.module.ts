import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ChartsModule } from 'ng2-charts';

// PIPE ESPAÑOL
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
// registrar los locales con el nombre que quieras utilizar a la hora de proveer
registerLocaleData(localeEsAr, 'es-Ar');

//HTTP SERVICE.
import { InterceptorService } from './services/auth/interceptor.service';

import { AppComponent } from './app.component';
import { UsersPage } from './pages/users/users.page';
import { ProductsPage } from './pages/products/products.page';
import { AddEditProductsPage } from './pages/add-edit-products/add-edit-products.page';
import { PaginacionComponent } from './components/paginacion/paginacion.component';

import { FooterComponent } from './shared/footer/footer.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { TabSelectorComponent } from './components/tab-selector/tab-selector.component';
import { TitleSectionComponent } from './components/title-section/title-section.component';
import { TabContentComponent } from './components/tab-content/tab-content.component';
import { TabProductsComponent } from './pages/tab-products/tab-products.component';
import { TabCategoriesComponent } from './pages/tab-categories/tab-categories.component';
import { TabBrandsComponent } from './pages/tab-brands/tab-brands.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconComponent } from './components/icon/icon.component';
import { TabUsersComponent } from './pages/tab-users/tab-users.component';
import { AddEditCategoriesComponent } from './pages/add-edit-categories/add-edit-categories.component';
import { AddEditBrandsComponent } from './pages/add-edit-brands/add-edit-brands.component';
import { TabProvidersComponent } from './pages/tab-providers/tab-providers.component';
import { AddEditProvidersComponent } from './pages/add-edit-providers/add-edit-providers.component';
import { AddEditUsersComponent } from './pages/add-edit-users/add-edit-users.component';
import { MovementsComponent } from './pages/movements/movements.component';
import { AddEditClientesComponent } from './pages/add-edit-clientes/add-edit-clientes.component';
import { TabClientesComponent } from './pages/tab-clientes/tab-clientes.component';
import { MovementsListComponent } from './pages/movements-list/movements-list.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { ConfigurationsComponent } from './pages/configurations/configurations.component';
import { TabSizesComponent } from './pages/tab-sizes/tab-sizes.component';
import { AddEditSizesComponent } from './pages/add-edit-sizes/add-edit-sizes.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { AddEditExpensesComponent } from './pages/add-edit-expenses/add-edit-expenses.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersPage,
    AddEditProductsPage,
    ProductsPage,
    FooterComponent,
    SidebarComponent,
    NavbarComponent,
    LoginComponent,
    PaginacionComponent,
    DashboardPage,
    TabSelectorComponent,
    TitleSectionComponent,
    TabContentComponent,
    TabProductsComponent,
    TabCategoriesComponent,
    TabBrandsComponent,
    IconComponent,
    TabUsersComponent,
    AddEditCategoriesComponent,
    AddEditBrandsComponent,
    TabProvidersComponent,
    AddEditProvidersComponent,
    AddEditUsersComponent,
    MovementsComponent,
    AddEditClientesComponent,
    TabClientesComponent,
    MovementsListComponent,
    StatisticsComponent,
    ConfigurationsComponent,
    TabSizesComponent,
    AddEditSizesComponent,
    ExpensesComponent,
    AddEditExpensesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    AngularEditorModule,
    ImageCropperModule,
    FontAwesomeModule,
    ToastrModule.forRoot({
      // ToastrModule added
      timeOut: 3000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
    }),
    ChartsModule
  ],
  exports: [],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-Ar' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
