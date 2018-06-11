import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { TopicService } from '../topic.service';
import {SelectProductDialogComponent} from '../select-product-dialog/select-product-dialog.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-promote-promote-edit',
  templateUrl: './promote-edit.component.html',
  styleUrls: ['../_topic.scss']
})

export class PromoteEditComponent implements OnInit {

  currency: string = 'USD';

  promotionForm: FormGroup;

  image: any;

  campaign: any = {};

  categoryList: any;

  promotionProducts: any;

  promotionId: any;

  page = 1;

  pageSize = 6;

  length = 1;

  pageSizeOptions = [12];

  constructor(
    private promoteService: TopicService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {

    this.promotionForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      image: ['']
    });

    this.promotionId = this.activatedRoute.snapshot.params['id'];
    this.getPromotionDetail();
    this.getPromotionProductList()
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

  getPromotionDetail() {
    let id = this.promotionId;
    this.promoteService.getPromotionDetail({
      id
    }).then((data) => {
      this.campaign = data;
      this.promotionForm.patchValue({
        id: data.id,
        name: data.name,
        image: data.image
      });
      this.image = data.image
    });
  }

  // MatPaginator Output
  changePage(event) {
    this.pageSize = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getPromotionProductList();
  }

  getPromotionProductList() {
    this.promoteService.getSelectedPromotionProductList({
      topicId: this.promotionId,
      page: this.page,
      page_size: this.pageSize
    }).then((data) => {
      this.length = data.count;
      this.promotionProducts = [...data.results];
    });
  }


  changePromotionProduct(event) {
    switch (event.event) {
      case 'delete':
        this.promotionProducts.splice(event.index, 1);
        break;
      case 'save':
        this.campaign = event.promote;
        break;
    }
  }

  save() {
    if(this.promotionForm.invalid) {
      return;
    }

    let params = this.promotionForm.value;

    params.image = this.image;

    this.promoteService.promotionEdit(params).then((data) => {
      this.campaign = data;
      this.router.navigate(['../../'],{relativeTo: this.activatedRoute});
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

}
