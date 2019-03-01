import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { HotProductService } from '../hot-product.service';

@Component({
  selector: 'app-admin-hot-product-select-product-dialog',
  templateUrl: './select-product-dialog.component.html',
  styleUrls: ['../_hot-product.scss']
})

export class SelectProductDialogComponent implements OnInit {

  currency: string = 'USD';

  searchKey: any = '';
  isSearch: boolean = false;
  searchForm: FormGroup;

  categoryList: any = [];
  subCategoryList: any = [];
  thirdCategoryList: any = [];
  searchCategory = 'product';

  searchList: any = [{
    text: 'Product Name',
    value: 'product'
  }, {
    text: 'SPU',
    value: 'spu'
  }, {
    text: 'Shop Name',
    value: 'shop'
  }];

  error: any = false;

  cat: any;
  min: any;
  max: any;

  promotionProduct: any;

  length = 12;
  page = 1;
  pageSize = 6;

  constructor(
    public dialogRef: MatDialogRef<SelectProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private promoteService: HotProductService,
    private fb: FormBuilder
  ) {

    this.searchForm = this.fb.group({
      searchKey: ['']
    });

    this.categoryList = this.data.category;

    this.categoryList.unshift({
      id: false,
      data: {
        name: 'All'
      }
    });


    this.searchForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.getPromoteProduct();
  }

  ngOnInit(): void {

  }

  close() {
    this.dialogRef.close();
  }

  onValueChanged(data) {
    this.isSearch = false;
  }

  clearSearchKey() {
    this.searchKey = '';
  }

  getPromoteProduct() {
    let param: any = {};
    let min_price: any = this.min && this.min != ''? this.min: null;
    let max_price: any = this.max && this.max != ''? this.max: null;
    if(this.searchKey != '') {
      param = {
        category: this.cat,
        search: this.searchKey,
        search_type: this.searchCategory,
        page: this.page,
        page_size: this.pageSize,
        min_price,
        max_price
      };
    } else {
      param = {
        category: this.cat,
        page: this.page,
        page_size: this.pageSize,
        min_price,
        max_price
      }
    }

    this.promoteService.getPromotionProductList(param).then((data) => {
      this.length = data.count;
      this.promotionProduct = data.results;
    });
  }

  changePage($event) {
    this.page = $event.page;
    this.getPromoteProduct();
  }

  categorySelect($event) {
    this.cat = $event;

    this.getPromoteProduct();
  }

  promoteChanges(event) {
    if(event.event == 'changed') {
      this.error = false;
      this.data.isEdit = true;
      this.promotionProduct.splice(event.index,1);
    } else if(event.event == 'error') {
      this.error = event.promote;
    }
  }

  categoryChange($event) {
    if(this.categoryList.length > 0) {
      let index = this.categoryList.findIndex((data) => {
        if(data.id == $event) {
          return true;
        }
      });
      if(this.categoryList[index] && this.categoryList[index].children) {
        this.subCategoryList = [...this.categoryList[index].children];
      } else {
        this.subCategoryList = false;
        this.thirdCategoryList = false;
      }
      this.cat = $event;
      this.getPromoteProduct();
    }
  }

  subCategoryChange($event) {
    if(this.subCategoryList.length > 0) {
      let index = this.subCategoryList.findIndex((data) => {
        if(data.id == $event) {
          return true;
        }
      });
      if(this.subCategoryList[index] && this.subCategoryList[index].children) {
        this.thirdCategoryList = [...this.subCategoryList[index].children];
      } else {
        this.thirdCategoryList = [];
      }
    }
    this.cat = $event;
    this.getPromoteProduct();
  }

  thirdCategoryChange($event) {
    this.cat = $event;
    this.getPromoteProduct();
  }
}
