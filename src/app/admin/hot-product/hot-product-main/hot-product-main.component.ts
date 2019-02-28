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

  categoryId: any;

  constructor(
    private promoteService: HotProductService,
    private dialog: MatDialog
  ) {

    this.getPromotionList();
  }

  ngOnInit(): void {
  }

  getPromotionList() {
    this.promoteService.productRank().then((data) => {
      this.productRank = [...data];
    });
  }

  changePromotionProduct(event) {
    switch (event.event) {
      case 'delete':
        this.productRank.splice(event.index, 1);
        break;
    }
  }

  selectProduct() {

    let dialogRef = this.dialog.open(SelectProductDialogComponent, {
      data: {
        categoryId: this.categoryId,
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isEdit == true) {

      }
    });
  }


}
