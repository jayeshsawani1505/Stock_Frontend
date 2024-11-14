import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
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
    AddCustomer(customerData: any, file?: File): Observable<any> {
        const formData = new FormData();

        // Add customer data fields
        Object.keys(customerData).forEach(key => {
            formData.append(key, customerData[key]);
        });

        // Add profile photo if provided
        if (file) {
            formData.append('profile_photo', file);
        }

        return this.httpClient
            .post(`${environment.baseURL}/customers`, formData)
            .pipe(catchError(this.handleError));
    }

    // update a customer
    UpdateCustomer(customerId: any, customerData: any, file?: File): Observable<any> {
        const formData = new FormData();

        // Append customer data fields to FormData
        Object.keys(customerData).forEach(key => {
            formData.append(key, customerData[key]);
        });

        // Append profile photo if provided
        if (file) {
            formData.append('profile_photo', file);
        }

        return this.httpClient
            .put(`${environment.baseURL}/customers/${customerId}`, formData)
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
