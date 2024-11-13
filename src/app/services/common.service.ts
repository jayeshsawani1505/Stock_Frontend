import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: any) {
        return throwError(error);
    }

    getProductChartData(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/common/chart-data`)
            .pipe(catchError(this.handleError));
    }

    getInvoiceStatusWise(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/common/invoices/status-wise`)
            .pipe(catchError(this.handleError));
    }
}