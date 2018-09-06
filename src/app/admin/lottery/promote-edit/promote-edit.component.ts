import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { LotteryService } from '../lottery.service';
import {SelectProductDialogComponent} from '../select-product-dialog/select-product-dialog.component';

@Component({
  selector: 'app-lottery-promote-edit',
  templateUrl: './promote-edit.component.html',
  styleUrls: ['../_lottery.scss']
})

export class PromoteEditComponent implements OnInit {

  currency: string = 'USD';

  campaign: any = {};

  categoryList: any;

  promotionProducts: any;

  promotionId: any;

  cardList: any;

  second: any;

  third: any;

  constructor(
    private promoteService: LotteryService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.promotionId = this.activatedRoute.snapshot.params['id'];
    this.getPromotionDetail();
  }

  ngOnInit(): void {
    this.promoteService.getCategoryList().then((data) => {
      this.categoryList = data;
      this.categoryList.unshift({
        id: 'all',
        name: 'All'
      });
    });

    this.getCardList();
  }

  getCardList() {
    this.promoteService.getCardList().then((res) => {
      this.cardList = res;
      for(let item of res) {
        if(item.name == 'Rs.150') {
          this.second = item.id;
          this.third = item.id;
        }
      }
    });
  }

  getPromotionDetail() {
    let id = this.promotionId;
    this.promoteService.getPromotionDetail({
      id
    }).then((data) => {
      this.campaign = data;
      this.promotionProducts = data.product;
    });
  }

  changePromotionProduct(event) {
    switch (event.event) {
      case 'delete':
        this.campaign.product.splice(event.index, 1);
        break;
      case 'save':
        // this.campaign = event.promote;
        break;
    }
  }

  save() {
    if(this.campaign.title == '') {
      return false;
    }
    this.promoteService.promotionEdit(this.campaign).then((data) => {
      this.campaign = data;
    });
  }


  cardSecondSelect($event) {

  }

  cardThirdSelect($event) {

  }


  selectProduct() {
    let dialogRef = this.dialog.open(SelectProductDialogComponent, {
      data: {
        categoryList: this.categoryList,
        promotionId: this.campaign.id,
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

}
