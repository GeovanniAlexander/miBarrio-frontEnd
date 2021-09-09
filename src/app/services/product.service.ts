import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = "http://localhost:8080/api";

  constructor(private httpClient: HttpClient) { }

  getProductList(categoryId: number) : Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/products/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(searchUrl);
  }

  getProduct(productId: number) : Observable<Product>{
    const searchUrl = `${this.baseUrl}/products/${productId}`
    return this.httpClient.get<Product>(searchUrl);
  }

  getProductCategories() : Observable<ProductCategory[]>{
    const searchUrl = `${this.baseUrl}/product-category`
    return this.httpClient.get<GetResponseProductCategory>(searchUrl).pipe(
      map(resp => resp._embedded.productCategory)
    );
  }

  searchProducts(keyword : string) : Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/products/search/findByNameContaining?name=${keyword}`;
    return this.getProducts(searchUrl);
  }

  getProducts(searchUrl : string) : Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(resp => resp._embedded.products)
    );
  }

}

interface GetResponseProducts{
  _embedded: {
    products: Product[];
  }
}

interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[];
  }
}
