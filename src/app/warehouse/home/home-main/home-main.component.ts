import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { HomeService } from '../home.service';
import { UserService } from  '../../../shared/services/user/user.service';
import { HomeCreateDialogComponent } from '../home-create-dialog/home-create-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-warehouse-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['../_home.scss']
})

export class HomeMainComponent implements OnInit {

  selectedIndex: number = 0;

  searchKey: any = '';
  isSearch: boolean = false;
  searchForm: FormGroup;

  searchCategory: any = 'purchase';

  searchList:any = [{
    text: '采购单号',
    value: 'purchase'
  }, {
    text: '快递单号',
    value: 'delivery'
  }];

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 50;
  pageSizeOptions = [25, 50];

  isSuperuser: boolean = false;

  purchaseAll: any = false;
  purchaseAllIndex: any = 1;
  purchaseProccessing: any = false;
  purchaseProccessingIndex: any = 1;
  purchaseShipped: any = false;
  purchaseShippedIndex: any = 1;
  purchaseDelivered: any = false;
  purchaseDeliveredIndex: any = 1;

  constructor(
    private adminService: HomeService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {

    this.userService.currentUser.subscribe((data) => {
      if(data) {
        if(data.isStaff && data.isSuperuser) {
          this.isSuperuser = true
        }
      }
    });

    this.searchForm = this.fb.group({
      searchKey: ['']
    });

    this.searchForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.changePurchaseLists({
      index: 0
    });
  }

  onValueChanged(data) {
    this.isSearch = false;
  }

  clearSearchKey() {
    this.searchKey = '';
    this.selectedIndex = 0;
    this.changePurchaseLists({
      index: this.selectedIndex
    });
  }

  ngOnInit():void {
  }

  ngOnDestroy() {

  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  // MatPaginator Output
  changePage(event, type) {
    this.pageSize = event.pageSize;
    switch (type) {
      case 0:
        this.purchaseAllIndex = event.pageIndex + 1;
        break;
      case 1:
        this.purchaseProccessingIndex = event.pageIndex + 1;
        break;
      case 2:
        this.purchaseShippedIndex = event.pageIndex + 1;
        break;
      case 3:
        this.purchaseDeliveredIndex = event.pageIndex + 1;
        break;
    }
    this.changePurchaseLists({index: type});
  }

  changePurchaseLists($event) {

    let status: any = null;
    let page = this.purchaseAllIndex;
    let page_size = this.pageSize;
    switch ($event.index) {
      case 0:
        break;
      case 1:
        status = 'Processing';
        page = this.purchaseProccessingIndex;
        break;
      case 2:
        status = 'Shipped';
        page = this.purchaseShippedIndex;
        break;
      case 3:
        status = 'Delivered';
        page = this.purchaseDeliveredIndex;
        break;
    }

    let search: any = null;
    let search_type: any = null;
    if(this.searchKey && this.searchKey != '') {
      search = this.searchKey;
      search_type = this.searchCategory;
    }

    this.adminService.getPurchaseList({
      status,
      page,
      page_size,
      search,
      search_type
    }).then((data) => {
      this.length = data.count;
      switch ($event.index) {
        case 0:
          this.purchaseAll = [...data.results];
          break;
        case 1:
          this.purchaseProccessing = [...data.results];
          break;
        case 2:
          this.purchaseShipped = [...data.results];
          break;
        case 3:
          this.purchaseDelivered = [...data.results];
          break;
      }
    });
  }

  createPurchase() {
    let dialogRef = this.dialog.open(HomeCreateDialogComponent, {
      data: {
        isCreated: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isCreated == true) {
        this.selectedIndex = 0;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
      }
    });
  }

}
