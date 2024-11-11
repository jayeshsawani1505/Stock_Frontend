import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: any) {
        return throwError(error);
    }

    // Get all products
    GetProducts(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/products`)
            .pipe(catchError(this.handleError));
    }

    // Add a new product
    AddProduct(productData: any): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/products`, productData)
            .pipe(catchError(this.handleError));
    }

    // Update a product
    UpdateProduct(productId: any, productData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/products/${productId}`, productData)
            .pipe(catchError(this.handleError));
    }

    // Delete a product
    DeleteProduct(productId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/products/${productId}`)
            .pipe(catchError(this.handleError));
    }

    // Upload Excel file to add multiple customers
    UploadExcel(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.httpClient
            .post(environment.baseURL + `/products/upload-excel`, formData)
            .pipe(catchError(this.handleError));
    }
}
