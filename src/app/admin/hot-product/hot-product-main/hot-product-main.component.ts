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

  productRank: any;
  topProduct: any;

  categoryId: any;

  constructor(
    private promoteService: HotProductService,
    private dialog: MatDialog
  ) {
    this.getProductRankList();
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
    this.promoteService.productRank().then((data) => {
      this.productRank = [...data];
    });
  }

  getTopProductList() {
    this.promoteService.topProduct().then((data) => {
      this.topProduct = [...data];
    });
  }


  changePromotionProduct(event) {
    switch (event.status) {
      case 1:
        switch (event.event) {
          case 'delete':
            this.productRank.splice(event.index, 1);
            break;
        }
        break;
    }
  }

  selectProduct() {

    let dialogRef = this.dialog.open(SelectProductDialogComponent, {
      data: {
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isEdit == true) {

      }
    });
  }




}
