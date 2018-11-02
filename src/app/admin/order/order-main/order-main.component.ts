import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import { MatDialog } from '@angular/material';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { OrderService } from '../order.service';
import { UserService } from  '../../../shared/services/user/user.service';

import { utils, write, WorkBook } from 'xlsx';

import { saveAs } from 'file-saver';
import { AddGatiPostDialogComponent } from '../add-gati-post-dialog/add-gati-post-dialog.component';

@Component({
  selector: 'app-order-main',
  templateUrl: './order-main.component.html',
  styleUrls: ['../order.scss']
})

export class OrderMainComponent implements OnInit {


  orderUnpaid: any = false;
  orderUnpaidIndex = 1;
  orderPacking: any = false;
  orderPackingIndex = 1;
  orderShipped: any = false;
  orderShippedIndex = 1;
  orderAudit: any = false;
  orderAuditIndex = 1;
  orderCanceled: any = false;
  orderCanceledIndex = 1;
  orderCompleted: any = false;
  orderCompletedIndex = 1;
  orderRefund: any = false;
  orderRefundIndex = 1;

  selectedIndex: number = 0;
  subscription: any;

  searchKey: any = '';
  searchPackingKey: any = '';
  isSearch: boolean = false;
  isSearchResult: boolean = false;
  isSearchPackingResult: boolean = false;
  searchResult: any;
  searchForm: FormGroup;
  searchPackingForm: FormGroup;

  searchCategory = 'sku';
  searchList = ['sku','username','title'];

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 50;
  pageSizeOptions = [50];

  isSuperuser: any = false;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.searchForm = this.fb.group({
      searchKey: ['']
    });

    this.searchPackingForm = this.fb.group({
      searchPackingKey: ['']
    });

    this.searchForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.userService.currentUser.subscribe((data) => {
      if(data) {
        if(data.isStaff && data.isSuperuser) {
          this.isSuperuser = true
        }
      }
    });
  }

  onValueChanged(data) {
    this.isSearch = false;
  }

  clearSearchKey() {
    this.searchKey = '';
  }

  ngOnInit():void {
    let self = this;
    this.subscription = this.activatedRoute.queryParams.subscribe((data) => {
      switch(data.tab) {
        default:
          self.selectedIndex = 0;
          break;
      }

      self.changeProducts({
        index: self.selectedIndex
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // MatPaginator Output
  changePage(event, type) {
    this.pageSize = event.pageSize;
    switch (type) {
      case 0:
        this.orderUnpaidIndex = event.pageIndex + 1;
        break;
      case 1:
        this.orderPackingIndex = event.pageIndex + 1;
        break;
      case 2:
        this.orderShippedIndex = event.pageIndex + 1;
        break;
      case 3:
        this.orderAuditIndex = event.pageIndex + 1;
        break;
      case 4:
        this.orderCanceledIndex = event.pageIndex + 1;
        break;
      case 5:
        this.orderCompletedIndex = event.pageIndex + 1;
        break;
    }
    this.changeProducts({index: type});
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  changeReturnRequest($event) {
    this.changeProducts({
      index: 3
    });
  }


  changeProducts(event) {
    let status = '';
    let page = 0;
    switch (event.index) {
      case 0:
        status = 'Unpaid';
        page = this.orderUnpaidIndex;
        break;
      case 1:
        status = 'Packing';
        page = this.orderPackingIndex;
        break;
      case 2:
        status = 'Shipped';
        page = this.orderShippedIndex;
        break;
      case 3:
        status = 'Audit canceled';
        page = this.orderAuditIndex;
        break;
      case 4:
        status = 'Canceled';
        page = this.orderCanceledIndex;
        break;
      case 5:
        status = 'Completed';
        page = this.orderCompletedIndex;
        break;
      case 6:
        status = 'Refunded';
        page = this.orderCompletedIndex;
        break;
      default:
    }
    let self = this;
    if(this.isSearchResult) {
      this.isSearchResult = false;
      return;
    }
    this.orderService.getSupplyOrderList({
      status,
      page,
      page_size: this.pageSize,
      q: this.searchKey
    }).then((data) => {

      self.length = data.count;
      switch (event.index) {
        case 0:
          self.orderUnpaid = data.results;
          break;
        case 1:
          self.orderPacking = data.results;
          break;
        case 2:
          self.orderShipped = data.results;
          break;
        case 3:
          self.orderAudit = data.results;
          break;
        case 4:
          self.orderCanceled = data.results;
          break;
        case 5:
          self.orderCompleted = data.results;
          break;
        case 6:
          self.orderRefund = data.results;
          break;
      }
    });

  }

  searchResultProducts() {
    let self = this;
    self.isSearchResult = true;

    this.orderService.getSupplyOrderResult({
      number: this.searchKey
    }).then((data) => {
      if(data.length> 0) {
        switch (data[0].orderStatus) {
          case 'Unpaid':
            self.selectedIndex = 0;
            self.orderUnpaid = [...data];
            break;
          case 'Packing':
            self.selectedIndex = 1;
            self.orderPacking = [...data];
            break;
          case 'Paid':
            self.selectedIndex = 1;
            self.orderPacking = [...data];
            break;
          case 'Shipped':
            self.selectedIndex = 2;
            self.orderShipped = [...data];
            break;
          case 'Audit canceled':
            self.selectedIndex = 3;
            self.orderAudit = [...data];
            break;
          case 'Canceled':
            self.selectedIndex = 4;
            self.orderCanceled = [...data];
            break;
          case 'Completed':
            self.selectedIndex = 5;
            self.orderCompleted = [...data];
            break;
          case 'Refunded':
            self.selectedIndex = 6;
            self.orderRefund = [...data];
            break;
        }
      }
    });
  }

  searchPackingResult() {
    let self = this;
    self.isSearchPackingResult = true;

    if(self.searchPackingKey == '') return;

    let status = 'Packing';
    switch (self.selectedIndex) {
      case 0:
        status = 'Unpaid';
        break;
      case 2:
        status = 'Shipped';
        break;
      case 3:
        status = 'Audit canceled';
        break;
      case 4:
        status = 'Canceled';
        break;
      case 5:
        status = 'Completed';
        break;
      case 6:
        status = 'Refunded';
        break;
    }

    let params: any = {
      status,
      sku: self.searchPackingKey
    };

    switch(this.searchCategory) {
      case 'username':
        params = {
          status,
          username: self.searchPackingKey
        };
        break;
      case 'title':
        params = {
          status,
          title: self.searchPackingKey
        };
        break;
    }

    this.orderService.getSupplyOrderPackingResult(params).then((data) => {

      self.length = data.length;

      switch (self.selectedIndex) {
        case 0:
          self.orderUnpaid = [...data];
          break;
        case 1:
          self.orderPacking = [...data];
          break;
        case 2:
          self.orderShipped = [...data];
          break;
        case 3:
          self.orderAudit = [...data];
          break;
        case 4:
          self.orderCanceled = [...data];
          break;
        case 5:
          self.orderCompleted = [...data];
          break;
        case 6:
          self.orderRefund = [...data];
          break;
      }
    });
  }

  clearSearchPackingKey() {
    this.searchPackingKey = '';
  }

  productChange(event) {

  }

  export(): void {
    const ws_name = 'SomeSheet';
    const wb: WorkBook = { SheetNames: [], Sheets: {} };
    let packing: any = [];
    let excel: any = [];
    switch (this.selectedIndex) {
      case 0:
        excel = [...this.orderUnpaid];
        break;
      case 1:
        excel = [...this.orderPacking];
        break;
      case 2:
        excel = [...this.orderShipped];
        break;
      case 3:
        excel = [...this.orderAudit];
        break;
      case 4:
        excel = [...this.orderCanceled];
        break;
      case 5:
        excel = [...this.orderCompleted];
        break;
      case 6:
        excel = [...this.orderRefund];
        break;
    }

    for(let item of excel) {
      let orderItem: any = {};
      orderItem.orderNumber = item.number;
      orderItem.mainImage = item.lines[0].mainImage;
      orderItem.variants = item.lines[0].attributes;
      orderItem.productTitle = item.lines[0].title;
      orderItem.sku = item.lines[0].sku;
      orderItem.quantity = item.lines[0].quantity;
      orderItem.created = item.created.split('T')[0];
      orderItem.username = item.username;
      orderItem.address = item.line3 + (item.line3 != ''? '' : ',') + item.line2 + ',' + item.line1;
      orderItem.city = item.city;
      orderItem.state = item.state;
      orderItem.country = item.country;
      orderItem.postcode = item.postcode;
      orderItem.phoneNumber = item.phoneNumber;
      orderItem.email = item.email;
      orderItem.paymentAmount = item.paymentAmount;
      packing.push(orderItem);
    }

    const ws: any = utils.json_to_sheet(packing);
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    const wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    }

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'exported.xlsx');

  }

  createTracking() {
    let dialogRef = this.dialog.open(AddGatiPostDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

}
