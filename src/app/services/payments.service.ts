import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    // Get all payments
    GetPayments(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/payments`)
            .pipe(catchError(this.handleError));
    }

    getFilteredPayments(filters: { startDate?: string; endDate?: string; customerId?: number }): Observable<any> {
        const params: any = {};

        // Add query parameters only if they exist
        if (filters.startDate) {
            params.startDate = filters.startDate;
        }
        if (filters.endDate) {
            params.endDate = filters.endDate;
        }
        if (filters.customerId) {
            params.customerId = filters.customerId;
        }

        return this.httpClient
            .get(environment.baseURL + `/payments/report/filter`, { params })
            .pipe(catchError(this.handleError));
    }

    getFilteredTransactionLogs(filters: { startDate?: string; endDate?: string; customerId?: number }): Observable<any> {
        const params: any = {};

        // Add query parameters only if they exist
        if (filters.startDate) {
            params.startDate = filters.startDate;
        }
        if (filters.endDate) {
            params.endDate = filters.endDate;
        }
        if (filters.customerId) {
            params.customerId = filters.customerId;
        }

        return this.httpClient
            .get(environment.baseURL + `/payments/transaction/report/filter`, { params })
            .pipe(catchError(this.handleError));
    }

    // Add a new payment
    AddPayment(paymentData: any): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/payments`, paymentData)
            .pipe(catchError(this.handleError));
    }

    // Update a payment
    UpdatePayment(paymentId: any, paymentData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/payments/${paymentId}`, paymentData)
            .pipe(catchError(this.handleError));
    }

    // Delete a payment
    DeletePayment(paymentId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/payments/${paymentId}`)
            .pipe(catchError(this.handleError));
    }
}
