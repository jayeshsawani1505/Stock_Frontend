import { Routes } from "@angular/router";
import { QuotationsComponent } from "./quotations/quotations.component";
import { QuotationsAddEditComponent } from "./quotations/quotations-add-edit/quotations-add-edit.component";
import { DeliveryChallansComponent } from "./delivery-challans/delivery-challans.component";
import { DeliveryChallansAddEditComponent } from "./delivery-challans/delivery-challans-add-edit/delivery-challans-add-edit.component";

export const QuotationsRoutingModule: Routes = [
  { path: 'list', component: QuotationsComponent },
  { path: 'quotations-add', component: QuotationsAddEditComponent },
  { path: 'quotations-edit/:id', component: QuotationsAddEditComponent },
  { path: 'delivery-challans', component: DeliveryChallansComponent },
  { path: 'delivery-challans-add', component: DeliveryChallansAddEditComponent },
  { path: 'delivery-challans-edit/:id', component: DeliveryChallansAddEditComponent },
]
