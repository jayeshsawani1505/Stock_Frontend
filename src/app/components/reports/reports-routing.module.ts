import { Routes } from "@angular/router";
import { PaymentSummaryComponent } from "./payment-summary/payment-summary.component";
import { PurchaseReportComponent } from "./purchase-report/purchase-report.component";
import { QuotationReportComponent } from "./quotation-report/quotation-report.component";
import { ExpenseReportComponent } from "./expense-report/expense-report.component";

export const ReportsRoutingModule: Routes = [
  { path: 'payment-summary', component: PaymentSummaryComponent },
  { path: 'purchase-report', component: PurchaseReportComponent },
  { path: 'quotation-report', component: QuotationReportComponent },
  { path: 'expense-report', component: ExpenseReportComponent },
]
