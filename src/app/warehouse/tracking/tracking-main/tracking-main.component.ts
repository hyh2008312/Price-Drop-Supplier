import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { TrackingService } from '../tracking.service';
import { UserService } from  '../../../shared/services/user/user.service';
import { TrackingCreateDialogComponent } from '../tracking-create-dialog/tracking-create-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-warehouse-tracking-main',
  templateUrl: './tracking-main.component.html',
  styleUrls: ['../_tracking.scss']
})

export class TrackingMainComponent implements OnInit {

  selectedIndex: number = 0;

  searchKey: any = '';
  isSearch: boolean = false;
  searchForm: FormGroup;

  searchCategory: any = 'international_tracking_number';

  searchList:any = [{
    text: '运单号',
    value: 'international_tracking_number'
  }, {
    text: '检货单号',
    value: 'pick_number'
  }, {
    text: '订单号',
    value: 'order_number'
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
  purchaseDeleted: any = false;
  purchaseDeletedIndex: any = 1;

  constructor(
    private adminService: TrackingService,
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
        this.purchaseDeletedIndex = event.pageIndex + 1;
        break;
    }
    this.changePurchaseLists({index: type});
  }

  changePurchaseLists($event) {

    let status: any = null;
    let page = this.purchaseAllIndex;
    let page_size = this.pageSize;
    let received_time: any = null;
    switch ($event.index) {
      case 0:
        break;
      case 1:
        status = 'Pending Packaging';
        page = this.purchaseProccessingIndex;
        break;
      case 2:
        status = 'Packaging Completed';
        page = this.purchaseShippedIndex;
        break;
      case 3:
        status = 'Package Deleted';
        page = this.purchaseDeletedIndex;
        received_time = true;
        break;
    }

    let search: any = null;
    let search_type: any = null;
    if(this.searchKey && this.searchKey != '') {
      search = this.searchKey;
      search_type = this.searchCategory;
    }

    this.adminService.getPickList({
      status,
      page,
      page_size,
      search,
      search_type,
      received_time
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
          this.purchaseDeleted = [...data.results];
          break;
      }
    });
  }

  createPurchase() {
    let dialogRef = this.dialog.open(TrackingCreateDialogComponent, {
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

  productChange(event) {
    switch(event.status) {
      case 1:
        switch(event.event) {
          case 'delete':
            this.purchaseProccessing.splice(event.index,1);
            break;
          case 'change':
            this.purchaseProccessing.splice(event.index,1);
            break;
        }
        break;
      case 2:
        switch(event.event) {
          case 'change':
            this.purchaseShipped.splice(event.index,1);
            break;
        }
        break;
      case 3:
        switch(event.event) {
          case 'delete':
            this.purchaseDeleted.splice(event.index,1);
            break;
          case 'complete':
            this.purchaseDeleted.splice(event.index,1);
            break;
        }
        break;
    }
  }

}
