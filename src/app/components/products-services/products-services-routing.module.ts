import { Routes } from "@angular/router";
import { CategoryListComponent } from "./category-list/category-list.component";
import { ProductAddEditComponent } from "./product-list/product-add-edit/product-add-edit.component";
import { ProductListComponent } from "./product-list/product-list.component";



export const ProductsServicesRoutingModule: Routes = [
  { path: 'product-list', component: ProductListComponent },
  { path: 'product-add', component: ProductAddEditComponent },
  { path: 'product-edit/:id', component: ProductAddEditComponent },
  { path: 'category-list', component: CategoryListComponent },
]
