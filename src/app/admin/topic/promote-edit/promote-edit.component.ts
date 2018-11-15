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

  promotionProducts: any = [];

  promotionId: any;

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
      image: [''],
      color: [],
      topicOne: [],
      topicTwo: [],
      topicThree: []
    });

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
  }

  getPromotionDetail() {
    let id = this.promotionId;
    this.promoteService.getPromotionDetail({
      id
    }).then((data) => {
      this.promotionForm.patchValue({
        id: data.id,
        name: data.name,
        image: data.image,
        color: data.color,
        topicOne: data.topicOne,
        topicTwo: data.topicTwo,
        topicThree: data.topicThree
      });
      this.image = data.image;
      this.promotionProducts = [...data.products];
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
      case 'changed':
        this.getPromotionDetail();
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
      this.router.navigate(['../../'],{relativeTo: this.activatedRoute});
    });
  }


  selectProduct() {
    let dialogRef = this.dialog.open(SelectProductDialogComponent, {
      data: {
        categoryList: this.categoryList,
        promotionId: this.promotionId,
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
