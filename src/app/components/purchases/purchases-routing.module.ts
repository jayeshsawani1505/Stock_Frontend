import { Routes } from "@angular/router";
import { PurchasesListComponent } from "./purchases-list/purchases-list.component";
import { PurchaseAddEditComponent } from "./purchases-list/purchase-add-edit/purchase-add-edit.component";
import { DebitNotesComponent } from "./debit-notes/debit-notes.component";
import { DebitNotesAddEditComponent } from "./debit-notes/debit-notes-add-edit/debit-notes-add-edit.component";

export const PurchasesRoutingModule: Routes = [
  { path: 'list', component: PurchasesListComponent },
  { path: 'purchase-add', component: PurchaseAddEditComponent },
  { path: 'purchase-edit/:id', component: PurchaseAddEditComponent },
  { path: 'debit-notes', component: DebitNotesComponent },
  { path: 'debit-notes-add', component: DebitNotesAddEditComponent },
  { path: 'debit-notes-edit/:id', component: DebitNotesAddEditComponent },
]
