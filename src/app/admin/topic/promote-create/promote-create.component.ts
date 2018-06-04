import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { TopicService } from '../topic.service';

import { SelectProductDialogComponent } from  '../select-product-dialog/select-product-dialog.component';

@Component({
  selector: 'app-promote-promote-create',
  templateUrl: './promote-create.component.html',
  styleUrls: ['../_topic.scss']
})

export class PromoteCreateComponent implements OnInit {

  currency: string = 'USD';

  promotionForm: FormGroup;

  campaignType = ['Flash Sale'];

  isEdit: boolean = false;

  campaign: any = {};

  page = 1;

  pageSize = 6;

  length = 1;

  pageSizeOptions = [12];

  promotionProducts: any = [];

  categoryList: any;

  image: any;

  constructor(
    private promoteService: TopicService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    this.promotionForm = this.fb.group({
      name: ['', Validators.required],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.promoteService.getCategoryList().then((data) => {
      this.categoryList = data;
      this.categoryList.unshift({
        id: 'all',
        name: 'All'
      });
    });
  }

  continue() {
    if(this.promotionForm.invalid) {
      return;
    }

    let params = this.promotionForm.value;

    params.image = this.image;

    this.promoteService.promotionCreate(this.promotionForm.value).then((data) => {
      if(data) {
        this.isEdit = true;
        this.campaign = data;
      }
    });
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
        self.getPromotionProductList();
      }
    });
  }

  changePromotionProduct(event) {
    switch(event.event) {
      case 'delete':
        this.promotionProducts.splice(event.index, 1);
        break;
      case 'discount':
        this.promotionProducts[event.index] = event.promote;
    }
  }

  save() {
    if(!this.promotionProducts || this.promotionProducts.length <= 0) {
      return this.router.navigate(['../'],{relativeTo: this.activatedRoute});
    }

    let discounts: any = [];
    for(let item of this.campaign.promotionProducts) {
      discounts.push({
        pid: item.id,
        discount: item.discount
      });
    }

    this.promoteService.promotionEdit(this.campaign).then((data) => {
      this.router.navigate(['../'],{relativeTo: this.activatedRoute});
    });
  }

  getPromotionProductList() {
    this.promoteService.getSelectedPromotionProductList({
      topicId: this.campaign.id,
      page: this.page,
      page_size: this.pageSize
    }).then((data) => {
      this.length = data.count;
      this.promotionProducts = [...data.results];
    });
  }

  // MatPaginator Output
  changePage(event) {
    this.pageSize = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getPromotionProductList();
  }

}
