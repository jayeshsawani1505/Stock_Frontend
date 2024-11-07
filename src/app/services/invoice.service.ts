import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: any) {
        return throwError(error);
    }

    // Get all invoices
    GetInvoices(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/invoices`)
            .pipe(catchError(this.handleError));
    }

    // Add a new invoice
    AddInvoice(invoiceData: any): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/invoices`, invoiceData)
            .pipe(catchError(this.handleError));
    }

    // Update an invoice
    UpdateInvoice(invoiceId: any, invoiceData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/invoices/${invoiceId}`, invoiceData)
            .pipe(catchError(this.handleError));
    }

    // Delete an invoice
    DeleteInvoice(invoiceId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/invoices/${invoiceId}`)
            .pipe(catchError(this.handleError));
    }
}
