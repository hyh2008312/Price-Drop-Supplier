import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { LandingService } from '../landing.service';

@Component({
  selector: 'app-promote-select-product-dialog',
  templateUrl: './select-product-dialog.component.html',
  styleUrls: ['../_landing.scss']
})

export class SelectProductDialogComponent implements OnInit {

  currency: string = 'USD';

  searchKey: any = '';
  isSearch: boolean = false;
  searchForm: FormGroup;

  error: any = false;

  cat: any;

  promotionProduct: any;

  length = 12;
  page = 1;
  pageSize = 6;

  constructor(
    public dialogRef: MatDialogRef<SelectProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private promoteService: LandingService,
    private fb: FormBuilder
  ) {

    this.searchForm = this.fb.group({
      searchKey: ['']
    });

    this.cat = this.data.categoryId;

    this.searchForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.getPromoteProduct();
  }

  ngOnInit(): void {

  }

  close() {
    this.dialogRef.close();
  }

  onValueChanged(data) {
    this.isSearch = false;
  }

  clearSearchKey() {
    this.searchKey = '';
  }

  getPromoteProduct() {
    let param: any = {};
    if(this.searchKey != '') {
      param = {
        status: 'published',
        cat: this.cat,
        q: this.searchKey,
        qt: 'spu',
        topicId: this.data.promotionId,
        page: this.page,
        page_size: this.pageSize
      };
    } else {
      param = {
        status: 'published',
        cat: this.cat,
        topicId: this.data.promotionId,
        page: this.page,
        page_size: this.pageSize
      }
    }

    this.promoteService.getPromotionProductList(param).then((data) => {
      this.length = data.count;
      this.promotionProduct = data.results;
    });
  }

  changePage($event) {
    this.page = $event.page;
    this.getPromoteProduct();
  }

  categorySelect($event) {
    this.cat = $event;

    this.getPromoteProduct();
  }

  promoteChanges(event) {
    if(event.event == 'changed') {
      this.error = false;
      this.data.isEdit = true;
      this.promotionProduct.splice(event.index,1);
    } else if(event.event == 'error') {
      this.error = event.promote;
    }
  }
}
