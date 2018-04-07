import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { PromoteService } from '../promote.service';


@Component({
  selector: 'app-promote-promote-edit',
  templateUrl: './promote-edit.component.html',
  styleUrls: ['../_promote.scss']
})

export class PromoteEditComponent implements OnInit {

  currency: string = 'USD';

  campaign: any = {};

  categoryList: any;

  promotionProducts: any;

  promotionId: any;

  constructor(
    private promoteService: PromoteService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.promotionId = this.activatedRoute.snapshot.params['id'];
    this.getPromotionDetail();
  }

  ngOnInit(): void {
    this.promoteService.getCategoryList().then((data) => {
      this.categoryList = data;
    });
  }

  getPromotionDetail() {
    let id = this.promotionId;
    this.promoteService.getPromotionDetail({
      id
    }).then((data) => {
      this.campaign = data;
      this.promotionProducts = data.promotionProducts;
    });
  }

  changePromotionProduct(event) {
    switch (event.event) {
      case 'delete':
        this.campaign.promotionProducts.splice(event.index, 1);
        break;
      case 'save':
        this.campaign = event.promote;
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

}
