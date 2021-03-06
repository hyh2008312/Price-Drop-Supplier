import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';

import { LandingService } from '../landing.service';
import {SelectProductDialogComponent} from '../select-product-dialog/select-product-dialog.component';

@Component({
  selector: 'app-promote-promote-main',
  templateUrl: './promote-main.component.html',
  styleUrls: ['../_landing.scss']
})

export class PromoteMainComponent implements OnInit {

  selectedIndex: number = 0;

  currency: string = 'USD';

  categoryList: any = [];

  category: any = [];

  promotionProducts: any = [];

  categoryId: any;

  homeList: any = [];

  constructor(
    private promoteService: LandingService,
    private dialog: MatDialog
  ) {

    this.getPromotionDetail();
    this.getCategoryList();
  }

  ngOnInit(): void {
  }

  getCategoryPromote($event) {
    switch (this.selectedIndex) {
      case 0:
        this.getPromotionDetail();
        this.getCategoryList();
        break;
      case 1:
        this.getHomeList();
        break;
    }
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

  getHomeList() {
    this.promoteService.getHomeList().then((res) => {
      this.homeList = [...res];
    })
  }


  changePromotionProduct(event) {
    switch (event.status) {
      case 0:
        switch (event.event) {
          case 'delete':
            this.promotionProducts.splice(event.index, 1);
            break;
        }
        break;
      case 1:
        switch (event.event) {
          case 'delete':
            this.homeList.splice(event.index, 1);
            break;
        }
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
