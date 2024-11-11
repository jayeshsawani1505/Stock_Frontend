import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: any) {
        return throwError(error);
    }

    // Get all customers
    GetCustomers(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/customers`,)
            .pipe(catchError(this.handleError));
    }

    // Get all customers
    GetCustomersCount(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/customers/count`,)
            .pipe(catchError(this.handleError));
    }

    // Add a new customer
    AddCustomer(customerData: any): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/customers`, customerData)
            .pipe(catchError(this.handleError));
    }

    // update a customer
    UpdateCustomer(customerId: any, customerData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/customers/${customerId}`, customerData)
            .pipe(catchError(this.handleError));
    }

    // delete a customer
    DeleteCustomer(customerId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/customers/${customerId}`)
            .pipe(catchError(this.handleError));
    }
    // Upload Excel file to add multiple customers
    UploadExcel(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.httpClient
            .post(environment.baseURL + `/customers/upload-excel`, formData)
            .pipe(catchError(this.handleError));
    }
}
