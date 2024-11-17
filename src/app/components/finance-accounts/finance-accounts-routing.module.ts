import { Routes } from "@angular/router";
import { ExpensesComponent } from "./expenses/expenses.component";
import { PaymentsComponent } from "./payments/payments.component";
import { AddEditExpensesComponent } from "./expenses/add-edit-expenses/add-edit-expenses.component";

export const FinanceAccountsRoutingModule: Routes = [
  { path: 'expenses', component: ExpensesComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: 'expenses-add', component: AddEditExpensesComponent },
  { path: 'expenses-edit/:id', component: AddEditExpensesComponent },
]
