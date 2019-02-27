import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';

import { HotProductService } from '../hot-product.service';
import {SelectProductDialogComponent} from '../select-product-dialog/select-product-dialog.component';

@Component({
  selector: 'app-admin-hot-product-main',
  templateUrl: './hot-product-main.component.html',
  styleUrls: ['../_hot-product.scss']
})

export class HotProductMainComponent implements OnInit {

  selectedIndex: number = 0;

  currency: string = 'USD';

  categoryList: any = [];

  category: any = [];

  promotionProducts: any = [];

  categoryId: any;

  constructor(
    private promoteService: HotProductService,
    private dialog: MatDialog
  ) {

    this.getPromotionDetail();
    this.getCategoryList();
  }

  ngOnInit(): void {
  }

  getPromotionDetail() {
    this.promoteService.categoryProducts().then((data) => {
      this.categoryList = [...data];
      if(this.categoryId) {
        let index = this.categoryList.findIndex((e) => {
           return e.id == this.categoryId;
        });

        if(index > -1) {
          this.promotionProducts = [...this.categoryList[index].product];
        }

      }
    });
  }


  changePromotionProduct(event) {
    switch (event.event) {
      case 'delete':
        this.promotionProducts.splice(event.index, 1);
        break;
    }
  }

  getCategoryList() {
    this.promoteService.getCategoryList().then((data) => {
        this.category = [...data];
    });
  }

  selectProduct() {

    let categoryList: any = [];
    const newCategory = this.selectCategoryList(this.category, this.categoryId);
    for(let item of newCategory) {
      categoryList.push(item);
    }

    let dialogRef = this.dialog.open(SelectProductDialogComponent, {
      data: {
        categoryList,
        categoryId: this.categoryId,
        isEdit: false
      }
    });

    let self = this;

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isEdit == true) {
        self.getPromotionDetail();
      }
    });
  }

  selectCategoryList(list, id) {
    let newList = [];
    for(let item of list) {
      if(item.id == id) {
        return item.children;
      }
      if(item.children && item.children.length > 0) {
        for(let im of item.children) {
          newList.push(im);
        }
      }
    }
    return this.selectCategoryList(newList, id);
  }

  categoryChange($event) {
    this.categoryId = $event;
    let index = this.categoryList.findIndex((e) => {
      return e.id == this.categoryId;
    });
    this.promotionProducts = [...this.categoryList[index].product];

  }

}
