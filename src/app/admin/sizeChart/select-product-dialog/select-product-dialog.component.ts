import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SizeChartService } from '../sizeChart.service';
import { MatSnackBar } from '@angular/material';
import {ToolTipsComponent} from '../tool-tips/tool-tips.component';

@Component({
  selector: 'app-sizeChart-select-product-dialog',
  templateUrl: './select-product-dialog.component.html',
  styleUrls: ['../_sizeChart.scss']
})

export class SelectProductDialogComponent implements OnInit {

  currency: string = 'USD';

  searchKey: any = '';
  isSearch: boolean = false;
  searchForm: FormGroup;

  cat: any;
  min: any;
  max: any;

  promotionProduct: any;

  length = 12;
  page = 1;
  pageSize = 6;

  constructor(
    public dialogRef: MatDialogRef<SelectProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sizeChartService: SizeChartService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {

    this.searchForm = this.fb.group({
      searchKey: ['']
    });

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
        cat: this.cat,
        q: this.searchKey,
        qt: 'product',
        page: this.page,
        page_size: this.pageSize
      };
    } else {
      param = {
        cat: this.cat,
        page: this.page,
        page_size: this.pageSize
      }
    }

    this.sizeChartService.getProductList(param).then((data) => {
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
      this.data.isEdit = true;
      this.promotionProduct.splice(event.index,1);
    }
  }

  confirm() {
    let params: any = {};
    params.chartId = this.data.promotionId;
    params.productId = [];

    if(this.min && this.max) {
      for(let i = this.min; i <= this.max;i++) {
        params.productId.push(i);
      }
    } else if( this.min) {
      params.productId.push(this.min);
    } else if( this.max) {
      params.productId.push(this.max);
    } else {
      this.openSnackBar('The Product Id field is empty!');
      return;
    }

    this.sizeChartService.addProduct(params).then(((data) => {
      if(data.detail) {
        this.openSnackBar(data.detail);
      } else {
        this.openSnackBar('Add successfully!');
        this.data.isEdit = true;
      }
    }));
  }

  openSnackBar(str: any) {
    this.snackBar.openFromComponent(ToolTipsComponent, {
      data: str,
      duration: 4000,
      verticalPosition: 'top'
    });
  }
}
