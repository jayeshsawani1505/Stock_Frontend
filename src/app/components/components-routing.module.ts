import { Routes } from "@angular/router";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { AdminComponent } from "./components.component";
import { AuthGuard } from "../helpers/auth.gaurd";

export const AdminRoutingModule: Routes = [{
  path: '',
  component: AdminComponent,
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
    { path: 'application', loadChildren: () => import('./application/application-routing.module').then(m => m.ApplicationRoutingModule), canActivate: [AuthGuard] },
    { path: 'customers', loadChildren: () => import('./customers/customers-routing.module').then(m => m.CustomersRoutingModule), canActivate: [AuthGuard] },
    { path: 'signature', loadChildren: () => import('./signature/signature-routing.module').then(m => m.SignatureRoutingModule), canActivate: [AuthGuard] },
    { path: 'productsServices', loadChildren: () => import('./products-services/products-services-routing.module').then(m => m.ProductsServicesRoutingModule), canActivate: [AuthGuard] },
    { path: 'sales', loadChildren: () => import('./sales/sales-routing.module').then(m => m.SalesRoutingModule), canActivate: [AuthGuard] },
    { path: 'purchases', loadChildren: () => import('./purchases/purchases-routing.module').then(m => m.PurchasesRoutingModule), canActivate: [AuthGuard] },
    { path: 'finance-account', loadChildren: () => import('./finance-accounts/finance-accounts-routing.module').then(m => m.FinanceAccountsRoutingModule), canActivate: [AuthGuard] },
    { path: 'quotations', loadChildren: () => import('./quotations/quotations-routing.module').then(m => m.QuotationsRoutingModule) },
    { path: 'reports', loadChildren: () => import('./reports/reports-routing.module').then(m => m.ReportsRoutingModule), canActivate: [AuthGuard] },
  ]
}]