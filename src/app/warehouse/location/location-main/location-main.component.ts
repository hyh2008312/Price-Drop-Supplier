import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { LocationService } from '../location.service';

import { saveAs } from 'file-saver';
import { UserService } from '../../../shared/services/user/user.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-warehouse-location-main',
  templateUrl: './location-main.component.html',
  styleUrls: ['../_location.scss']
})

export class LocationMainComponent implements OnInit {

  selectedIndex: number = 0;

  searchKey: any = '';
  isSearch: boolean = false;
  searchForm: FormGroup;

  searchCategory: any = 'sku';

  searchList:any = [{
    text: 'SKU',
    value: 'sku'
  }];

  quantityList: any = [{
    text: 'INVENTORY.QUANTITYLIST.TITLE1',
    value: false
  }, {
    text: 'INVENTORY.QUANTITYLIST.TITLE2',
    value: '1'
  }, {
    text: 'INVENTORY.QUANTITYLIST.TITLE3',
    value: '0'
  }];

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 50;
  pageSizeOptions = [25, 50];

  isSuperuser: boolean = false;

  location: any = false;
  locationIndex: any = 1;
  inventoryWare: any = false;
  inventoryWareIndex: any = 1;

  warehouseId: any;
  warehouseList: any;

  showNav: any = false;

  lane: any;

  constructor(
    private locationService: LocationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private userService: UserService
  ) {

    this.userService.currentUser.subscribe((data) => {
      if(data) {
        if(data.isStaff && data.isSuperuser) {
          this.isSuperuser = true
        }
      }
    });

    this.getWarehouseList();

    this.searchForm = this.fb.group({
      searchKey: ['']
    });

    this.searchForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.changeLocationLists({
      index: this.selectedIndex
    });
  }

  onValueChanged(data) {
    this.isSearch = false;
  }

  clearSearchKey() {
    this.searchKey = '';
    this.changeLocationLists({
      index: this.selectedIndex
    });
  }

  ngOnInit():void {}

  ngOnDestroy() { }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  changePage(event) {
    this.pageSize = event.pageSize;
    this.changeLocationLists({index: this.selectedIndex});
  }

  changeLocationLists($event) {
    switch(this.selectedIndex) {
      case 0:
        let params = {
          warehouse_id: this.warehouseId? this.warehouseId: null
        };
        this.locationService.getLocationList(params).then((res) => {
          this.location = [...res];
        });
      break;
    }

  }

  getWarehouseList() {
    this.locationService.getWarehouseList().then((data) => {
      this.warehouseList = [...data];
      this.warehouseList.unshift({
        id: false,
        warehouseName: 'INVENTORY.QUANTITYLIST.TITLE1'
      });
    });
  }

  getAllLocationList() {
    this.locationService.getLocationList({}).then((data) => {
      this.lane = [...data];
    });
  }

  scrollChange($event) {
    this.showNav = $event;
  }

  warehouseChange(event) {
    this.warehouseId = event;
    this.changeLocationLists({index: this.selectedIndex});
  }

}
