import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class QuotationService {
    private baseUrl = `${environment.baseURL}/quotations`;
    private deliveryChallansBaseUrl = `${environment.baseURL}/delivery_challans`;

    constructor(private httpClient: HttpClient) { }

    // Generic error handler
    private handleError(error: HttpErrorResponse): Observable<never> {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    // Get all quotations
    getQuotations(): Observable<any> {
        return this.httpClient
            .get(`${this.baseUrl}`)
            .pipe(catchError(this.handleError));
    }

    getFilteredQuotations(filters: { startDate?: string; endDate?: string; customerId?: number }): Observable<any> {
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
            .get(this.baseUrl + `/report/filter`, { params })
            .pipe(catchError(this.handleError));
    }

    // Generate a quotation number
    generateQuotationNumber(): Observable<any> {
        return this.httpClient
            .get(`${this.baseUrl}/generateQuotationNumber`)
            .pipe(catchError(this.handleError));
    }

    // Add a new quotation
    addQuotation(quotationData: any): Observable<any> {
        return this.httpClient
            .post(`${this.baseUrl}`, quotationData)
            .pipe(catchError(this.handleError));
    }

    // Update a quotation
    updateQuotation(quotationId: string, quotationData: any): Observable<any> {
        return this.httpClient
            .put(`${this.baseUrl}/${quotationId}`, quotationData)
            .pipe(catchError(this.handleError));
    }

    // Delete a quotation
    deleteQuotation(quotationId: string): Observable<any> {
        return this.httpClient
            .delete(`${this.baseUrl}/${quotationId}`)
            .pipe(catchError(this.handleError));
    }
    // ===================== Delivery Challans =====================

    // Get all delivery challans
    getDeliveryChallans(): Observable<any> {
        return this.httpClient
            .get(`${this.deliveryChallansBaseUrl}`)
            .pipe(catchError(this.handleError));
    }

    // Generate a delivery challan number
    generateDeliveryChallanNumber(): Observable<any> {
        return this.httpClient
            .get(`${this.deliveryChallansBaseUrl}/generateDeliveryChallanNumber`)
            .pipe(catchError(this.handleError));
    }

    // Add a new delivery challan
    addDeliveryChallan(challanData: any): Observable<any> {
        return this.httpClient
            .post(`${this.deliveryChallansBaseUrl}`, challanData)
            .pipe(catchError(this.handleError));
    }

    // Update a delivery challan
    updateDeliveryChallan(challanId: string, challanData: any): Observable<any> {
        return this.httpClient
            .put(`${this.deliveryChallansBaseUrl}/${challanId}`, challanData)
            .pipe(catchError(this.handleError));
    }

    // Delete a delivery challan
    deleteDeliveryChallan(challanId: string): Observable<any> {
        return this.httpClient
            .delete(`${this.deliveryChallansBaseUrl}/${challanId}`)
            .pipe(catchError(this.handleError));
    }

    getChallanDetailsForPDF(id: any): Observable<any> {
        return this.httpClient
            .get(`${this.deliveryChallansBaseUrl}/pdf/${id}`)
            .pipe(catchError(this.handleError));
    }
}
