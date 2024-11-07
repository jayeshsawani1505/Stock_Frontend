import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/products.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [ProductService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  productList: any[] = []; // Define productList to store product data
  productIdToDelete: number | null = null;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.GetProducts();
  }

  // GetProducts method
  GetProducts() {
    this.productService.GetProducts().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.products) {
          this.productList = res.products; // Assign products data to productList
        }
      },
      error: (err: any) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  editProduct(Product: any) {
    this.router.navigate(['/admin/productsServices/product-edit', Product.product_id], {
      state: { productData: Product } // Pass product data as state
    });
  }

  onDelete(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.DeleteProduct(productId).subscribe({
        next: () => {
          this.productList = this.productList.filter(product => product.product_id !== productId);
          console.log(`Product with ID ${productId} deleted successfully.`);
        },
        error: (err: any) => {
          console.error('Error deleting product:', err);
        }
      });
    }
  }

}
