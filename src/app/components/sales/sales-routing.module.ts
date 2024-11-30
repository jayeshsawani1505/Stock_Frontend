import { Routes } from "@angular/router";
import { InvoicesListComponent } from "./invoices-list/invoices-list.component";
import { InvoicesAddEditComponent } from "./invoices-list/invoices-add-edit/invoices-add-edit.component";

export const SalesRoutingModule: Routes = [
  { path: 'invoices', component: InvoicesListComponent },
  { path: 'invoices-add', component: InvoicesAddEditComponent },
  { path: 'invoices-edit/:id', component: InvoicesAddEditComponent },
]
