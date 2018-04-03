import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { PromoteService } from '../promote.service';

@Component({
  selector: 'app-promote-select-product-dialog',
  templateUrl: './select-product-dialog.component.html',
  styleUrls: ['../_promote.scss']
})

export class SelectProductDialogComponent implements OnInit {

  currency: string = 'USD';

  searchKey: any = '';
  isSearch: boolean = false;
  searchForm: FormGroup;

  cat: any;

  promotionProduct: any;

  length = 12;
  page = 1;
  pageSize = 3;

  constructor(
    public dialogRef: MatDialogRef<SelectProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private promoteService: PromoteService,
    private fb: FormBuilder
  ) {

    this.searchForm = this.fb.group({
      searchKey: ['']
    });

    this.searchForm.valueChanges.subscribe(data => this.onValueChanged(data));

    //this.getPromoteProduct();
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
    let param = {
      cat: this.cat,
      q: this.searchKey,
      qt: 'product',
      pid: this.data.promotionId,
      page: this.page,
      pageSize: this.pageSize
    };

    this.promoteService.getPromotionProductList(param).then((data) => {
      this.length = data.count;
      this.promotionProduct = data;
    });
  }

  changePage($event) {
    this.page = $event.page;
    this.getPromoteProduct();
  }
}
