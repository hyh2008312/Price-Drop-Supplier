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

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 50;
  pageSizeOptions = [25, 50];

  isSuperuser: boolean = false;

  inventoryAll: any = false;
  inventoryAllIndex: any = 1;

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {

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
    this.inventoryAllIndex = event.index + 1;
    this.changeInventoryLists({index: this.selectedIndex});
  }

  changeInventoryLists($event) {
    let search: any = null;
    let search_type: any = null;
    if(this.searchKey && this.searchKey != '') {
      search = this.searchKey;
      search_type = this.searchCategory;
    }

    this.inventoryService.getInventoryList({
      page: this.inventoryAllIndex,
      pageSize: this.pageSize,
      search,
      search_type
    }).then((data) => {
      this.length = data.count;
      this.inventoryAll = [...data.results];
    })
  }


}
