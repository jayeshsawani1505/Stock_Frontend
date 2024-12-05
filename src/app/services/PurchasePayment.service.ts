import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class PurchasePaymentsService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: any) {
        return throwError(error);
    }

    // Get all purchase payments
    getPurchasePayments(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/purchase-payments`)
            .pipe(catchError(this.handleError));
    }

    // Get filtered purchase payments
    getFilteredPurchasePayments(filters: { startDate?: string; endDate?: string; vendorId?: number }): Observable<any> {
        const params: any = {};

        // Add query parameters only if they exist
        if (filters.startDate) {
            params.startDate = filters.startDate;
        }
        if (filters.endDate) {
            params.endDate = filters.endDate;
        }
        if (filters.vendorId) {
            params.vendorId = filters.vendorId;
        }

        return this.httpClient
            .get(environment.baseURL + `/purchase-payments/report/filter`, { params })
            .pipe(catchError(this.handleError));
    }

    // Add a new purchase payment
    addPurchasePayment(paymentData: any): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/purchase-payments`, paymentData)
            .pipe(catchError(this.handleError));
    }

    // Update a purchase payment
    updatePurchasePayment(paymentId: any, paymentData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/purchase-payments/${paymentId}`, paymentData)
            .pipe(catchError(this.handleError));
    }

    // Delete a purchase payment
    deletePurchasePayment(paymentId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/purchase-payments/${paymentId}`)
            .pipe(catchError(this.handleError));
    }

    // Upload Excel file to add multiple purchase payments
    uploadExcel(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.httpClient
            .post(environment.baseURL + `/purchase-payments/upload-excel`, formData)
            .pipe(catchError(this.handleError));
    }
}