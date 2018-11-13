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

  currency: string = 'USD';

  categoryList: any = [];

  category: any = [];

  promotionProducts: any = [];

  categoryId: any;

  constructor(
    private promoteService: LandingService,
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
    let index = this.category.findIndex((data) => {
      return data.id == this.categoryId;
    });

    const categoryList = this.category[index].children;

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

  categoryChange($event) {
    this.categoryId = $event;
    let index = this.categoryList.findIndex((e) => {
      return e.id == this.categoryId;
    });
    this.promotionProducts = [...this.categoryList[index].product];

  }

}
