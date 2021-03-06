import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { GetResponseProducts, ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  //templateUrl: './product-list.component.html',
  //templateUrl: './product-list-table.component.html',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products : Product[] = [];
  currentCategoryId : number = 1;
  previousCategoryId : number = 1;
  currentCategoryName !: string;
  searchMode !: boolean;

  pageNumber : number = 1;
  pageSize : number = 5;
  totalElements : number = 0; 

  previousKeyword : string = '';
  

  constructor(private productService: ProductService, 
              private route: ActivatedRoute,
              private cartService : CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>this.listProducts());
  }

  listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }
    else
      this.handleListProducts();
  }

  handleSearchProducts() {
    const keyword : string = this.route.snapshot.paramMap.get('keyword')!;

    if (keyword != this.previousKeyword)
      this.pageNumber = 1;
    
    this.previousKeyword = keyword;

    this.productService.searchProductsPaginate(this.pageNumber - 1, this.pageSize, keyword)
                        .subscribe(this.processResult());
  }

  handleListProducts() {
    const hasCategoryId : boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!; 
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books'
    }

    if (this.currentCategoryId != this.previousCategoryId){
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId)
                        .subscribe(this.processResult());
  }

  processResult() {
    return (data: GetResponseProducts) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }

  changePageSize(pageSize : string){
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCart(product : Product){
    const cartItem : CartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }

}
