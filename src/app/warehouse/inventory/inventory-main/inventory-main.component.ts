import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-warehouse-inventory-main',
  templateUrl: './inventory-main.component.html',
  styleUrls: ['../_inventory.scss']
})

export class InventoryMainComponent implements OnInit {

  selectedIndex: number = 0;

  searchKey: any = '';
  isSearch: boolean = false;
  searchForm: FormGroup;

  searchCategory: any = 'sku';

  searchList:any = [{
    text: 'SKU编号',
    value: 'sku'
  }];


  quantityList: any = [{
    text: '库存大于1',
    value: 1
  }, {
    text: '库存为0',
    value: 0
  }];

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 50;
  pageSizeOptions = [25, 50];

  isSuperuser: boolean = false;

  inventoryAll: any = false;
  quantityAll: any = 1;
  inventoryAllIndex: any = 1;
  inventoryWare: any = false;
  quantityWare: any = 1;
  inventoryWareIndex: any = 1;

  warehouseId: any = false;
  warehouseList: any;

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {

    this.getWarehouseList();

    this.searchForm = this.fb.group({
      searchKey: ['']
    });

    this.searchForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.changeInventoryLists({
      index: this.selectedIndex
    });
  }

  onValueChanged(data) {
    this.isSearch = false;
  }

  clearSearchKey() {
    this.searchKey = '';
    this.inventoryAllIndex = 1;
    this.changeInventoryLists({
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

  changePage(event) {
    this.pageSize = event.pageSize;
    this.inventoryAllIndex = event.pageIndex + 1;
    this.changeInventoryLists({index: this.selectedIndex});
  }

  changeInventoryLists($event) {
    let search: any = null;
    let search_type: any = null;
    let page = this.inventoryAllIndex;
    let quantity: any = null;

    if(this.searchKey && this.searchKey != '') {
      search = this.searchKey;
      search = encodeURIComponent(search);
      search_type = this.searchCategory;
      if($event.type == 'search') {
        this.inventoryAllIndex = 1;
      }
    }

    switch (this.selectedIndex) {
      case 0:
        quantity = this.quantityAll;
        quantity = quantity? quantity: null;
        this.inventoryService.getInventoryList({
          page,
          page_size: this.pageSize,
          search,
          search_type,
          quantity
        }).then((data) => {
          this.length = data.count;
          this.inventoryAll = [...data.results];
        });
        break;
      case 1:
        page = this.inventoryWareIndex;
        quantity = this.quantityWare;
        quantity = quantity? quantity: null;
        let warehouse_id: any = this.warehouseId? this.warehouseId: null;
        this.inventoryService.getWarehouseInventoryList({
          page,
          page_size: this.pageSize,
          search,
          search_type,
          quantity,
          warehouse_id
        }).then((data) => {
          this.length = data.count;
          this.inventoryWare = [...data.results];
        });
        break;
    }

  }

  quantityChange($event) {
    switch (this.selectedIndex) {
      case 0:
        this.quantityAll = $event;
        this.inventoryAllIndex = 1;
        break;
      case 1:
        this.quantityWare = $event;
        this.inventoryWareIndex = 1;
        break;
    }

    this.changeInventoryLists({
      index: this.selectedIndex
    });

  }

  warehouseChange($event) {
    switch (this.selectedIndex) {
      case 1:
        this.warehouseId = $event;
        this.inventoryWareIndex = 1;
        break;
    }
    this.changeInventoryLists({
      index: this.selectedIndex
    });
  }

  getWarehouseList() {
    this.inventoryService.getWarehouseList().then((data) => {
      this.warehouseList = [...data];
      this.warehouseList.unshift({
        id: false,
        warehouseName: '所有'
      });
    });
  }


}
