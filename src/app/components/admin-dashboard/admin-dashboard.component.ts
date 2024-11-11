import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/Customer.service';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  totalCustomers: any;
  totalInvoice: any;

  constructor(
    private CustomerService: CustomerService,
    private InvoiceService: InvoiceService,
  ) {
  }

  ngOnInit(): void {
    this.GetCustomersCount();
    this.GetInvoiceCount();
  }


  GetCustomersCount() {
    this.CustomerService.GetCustomersCount().subscribe({
      next: (res: any) => {
        this.totalCustomers = res.totalCustomers;
        console.log(res);
      }
    })
  }

  GetInvoiceCount() {
    this.InvoiceService.GetInvoiceCount().subscribe({
      next: (res: any) => {
        this.totalInvoice = res.totalInvoice;
        console.log(res);
      }
    })
  }
}
