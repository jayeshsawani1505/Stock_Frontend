import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class SubProductService {
    constructor(private httpClient: HttpClient) { }

    private handleError(error: any) {
        return throwError(error);
    }

    // Get all products
    GetSubProducts(): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/subproducts`)
            .pipe(catchError(this.handleError));
    }

    // Get all products
    GetSubProductsByProductId(product_id: any): Observable<any> {
        return this.httpClient
            .get(environment.baseURL + `/subproducts/product/${product_id}`)
            .pipe(catchError(this.handleError));
    }

    // Add a new product
    AddSubProduct(productData: any): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/subproducts`, productData)
            .pipe(catchError(this.handleError));
    }

    // Update a product
    UpdateSubProduct(productId: any, productData: any): Observable<any> {
        return this.httpClient
            .put(environment.baseURL + `/subproducts/${productId}`, productData)
            .pipe(catchError(this.handleError));
    }

    // Delete a product
    DeleteSubProduct(productId: any): Observable<any> {
        return this.httpClient
            .delete(environment.baseURL + `/subproducts/${productId}`)
            .pipe(catchError(this.handleError));
    }

    // Upload Excel file to add multiple customers
    UploadExcel(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.httpClient
            .post(environment.baseURL + `/subproducts/upload-excel`, formData)
            .pipe(catchError(this.handleError));
    }

    // In-stock (Add quantity to subproducts)
    InStock(subproduct_id: any, quantity: number): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/subproducts/in-stock/${subproduct_id}`, { quantity })
            .pipe(catchError(this.handleError));
    }

    // Out-stock (Remove quantity from subproducts)
    OutStock(subproduct_id: any, quantity: number): Observable<any> {
        return this.httpClient
            .post(environment.baseURL + `/subproducts/out-stock/${subproduct_id}`, { quantity })
            .pipe(catchError(this.handleError));
    }
}
