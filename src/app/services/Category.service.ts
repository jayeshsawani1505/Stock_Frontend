import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: any) {
        return throwError(error);
    }

    // Get all categories
    GetCategories(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/categories`)
            .pipe(catchError(this.handleError));
    }

    // Add a new category
    AddCategory(categoryData: any): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/categories`, categoryData)
            .pipe(catchError(this.handleError));
    }

    // Update a category
    UpdateCategory(categoryId: any, categoryData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/categories/${categoryId}`, categoryData)
            .pipe(catchError(this.handleError));
    }

    // Delete a category
    DeleteCategory(categoryId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/categories/${categoryId}`)
            .pipe(catchError(this.handleError));
    }
    
     // Upload Excel file to add multiple customers
     UploadExcel(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.httpClient
            .post(environment.baseURL + `/categories/upload-excel`, formData)
            .pipe(catchError(this.handleError));
    }
}
