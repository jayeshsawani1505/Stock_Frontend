import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class ExpensesService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error.message);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    // Get all Expenses
    GetExpenses(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/expenses`)
            .pipe(catchError(this.handleError));
    }

    // Add Expenses
    AddExpenses(expensesData: any, file?: File): Observable<any> {
        const formData = new FormData();
        Object.keys(expensesData).forEach(key => {
            formData.append(key, expensesData[key]);
        });
        if (file) {
            formData.append('attachment', file);
        }

        return this.httpClient
            .post(`${environment.baseURL}/expenses`, formData)
            .pipe(catchError(this.handleError));
    }

    // Update a Expenses
    UpdateExpenses(expense_id: any, expensesData: any, file?: File): Observable<any> {
        const formData = new FormData();
        Object.keys(expensesData).forEach(key => {
            formData.append(key, expensesData[key]);
        });
        if (file) {
            formData.append('attachment', file);
        }
        return this.httpClient
            .put(`${environment.baseURL}/expenses/${expense_id}`, formData)
            .pipe(catchError(this.handleError));
    }


    // Delete a Expenses
    DeleteExpenses(expense_id: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/expenses/${expense_id}`)
            .pipe(catchError(this.handleError));
    }
}
