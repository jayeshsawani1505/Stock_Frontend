import { Routes } from "@angular/router";
import { CustomersAddEditComponent } from "./customers-list/customers-add-edit/customers-add-edit.component";
import { CustomersListComponent } from "./customers-list/customers-list.component";
import { VendorsListComponent } from "./vendors-list/vendors-list.component";

export const CustomersRoutingModule: Routes = [
  { path: 'customers-list', component: CustomersListComponent },
  { path: 'customers-add', component: CustomersAddEditComponent },
  { path: 'customers-edit/:id', component: CustomersAddEditComponent },
  { path: 'vendors-list', component: VendorsListComponent },
]
