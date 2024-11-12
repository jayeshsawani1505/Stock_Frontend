import { Routes } from "@angular/router";
import { CategoryListComponent } from "./category-list/category-list.component";
import { InventoryListComponent } from "./inventory-list/inventory-list.component";
import { ProductAddEditComponent } from "./product-list/product-add-edit/product-add-edit.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { SubProductAddEditComponent } from "./sub-product-list/sub-product-add-edit/sub-product-add-edit.component";
import { SubProductListComponent } from "./sub-product-list/sub-product-list.component";



export const ProductsServicesRoutingModule: Routes = [
  { path: 'product-list', component: ProductListComponent },
  { path: 'product-add', component: ProductAddEditComponent },
  { path: 'product-edit/:id', component: ProductAddEditComponent },
  { path: 'subProduct-list', component: SubProductListComponent },
  { path: 'subProduct-add', component: SubProductAddEditComponent },
  { path: 'subProduct-edit/:id', component: SubProductAddEditComponent },
  { path: 'category-list', component: CategoryListComponent },
  { path: 'inventory-list', component: InventoryListComponent },
]
