import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';

import { ProductRankService } from '../product-rank.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';

@Component({
  selector: 'app-admin-product-rank-main',
  templateUrl: './product-rank-main.component.html',
  styleUrls: ['../_product-rank.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'en'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})

export class ProductRankMainComponent implements OnInit {

  selectedIndex: number = 0;

  currency: string = 'USD';

  csAll: any;
  ceAll: any;

  productRank: any;
  topProduct: any;

  categoryId: any;
  categoryList: any;
  subCategoryList: any;
  thirdCategoryList: any;

  constructor(
    private promoteService: ProductRankService,
    private dialog: MatDialog
  ) {
    this.getProductRankList();
    this.getCategoryList();
  }

  ngOnInit(): void {
  }

  changeProducts($event) {
    switch (this.selectedIndex) {
      case 0:
        this.getProductRankList();
        break;
      case 1:
        this.getTopProductList();
        break;
    }
  }

  getProductRankList() {
    let start_time = this.csAll? this.csAll: null;
    let end_time = this.ceAll? this.ceAll: null;
    let category_id = this.categoryId? this.categoryId: null;
    this.promoteService.categoryRank({
      start_time,
      end_time,
      category_id
    }).then((data) => {
      this.productRank = [...data];
    });
  }

  getTopProductList() {
    this.promoteService.conversionRank().then((data) => {
      this.topProduct = [...data];
    });
  }

  getCategoryList() {
    this.promoteService.getCategoryList().then((data) => {
      this.categoryList = [...data];
      this.categoryList.unshift({
        data: {
          name: 'All'
        },
        id: false
      })
    });
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
      this.categoryId = $event;
      this.changeProducts({
        index: this.selectedIndex
      });
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
    this.categoryId = $event;
    this.changeProducts({
      index: this.selectedIndex
    });
  }

  thirdCategoryChange($event) {
    this.categoryId = $event;
    this.changeProducts({
      index: this.selectedIndex
    });
  }

  addEvent(type: any, event:MatDatepickerInputEvent<any>) {
    if(event.value) {
      this[type] = event.value._i.year + '-'+ (event.value._i.month+1) +'-'+event.value._i.date + ' 00:00:00';
    } else {
      this[type] = null;
    }
  }

  filterDate() {
    this.changeProducts({
      index: this.selectedIndex
    });
  }

  resetDate() {
    this.csAll = null;
    this.ceAll = null;
    this.changeProducts({
      index: this.selectedIndex
    });
  }
}
