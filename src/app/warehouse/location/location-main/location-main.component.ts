import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { LocationService } from '../location.service';

import { saveAs } from 'file-saver';
import { UserService } from '../../../shared/services/user/user.service';
import { MatDialog } from '@angular/material';

import { AddLocationDialogComponent } from '../add-location-dialog/add-location-dialog.component';

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

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 50;
  pageSizeOptions = [25, 50];

  isSuperuser: boolean = false;

  location: any = false;
  locationIndex: any = 1;
  inventoryWare: any = false;
  inventoryWareIndex: any = 1;

  warehouseId: any = false;
  warehouseList: any;

  showNav: any = false;

  laneId: any = false;
  lane: any;
  rack: any;

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

    this.searchForm = this.fb.group({
      searchKey: ['']
    });

    this.searchForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.changeLocationLists({
      index: this.selectedIndex
    });

    this.userService.pubWarehouse.subscribe((res) => {
      this.warehouseId = res;
      switch (this.selectedIndex) {
        case 0:
          this.locationIndex = 1;
          break;
        case 1:
          this.inventoryWareIndex = 1;
          break;
      }
      this.laneId = false;
      this.getAllLocationList(this.warehouseId);
      this.changeLocationLists({index: this.selectedIndex});
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

  ngOnDestroy() {}

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
          warehouse_id: this.warehouseId? this.warehouseId: null,
          stock_id: this.laneId? this.laneId: null
        };
        this.locationService.getRackList(params).then((res) => {
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

  getAllLocationList(warehouseId) {
    let warehouse_id = warehouseId? warehouseId: null;
    this.locationService.getLaneList({
      warehouse_id
    }).then((data) => {
      this.lane = [...data];
      this.lane.unshift({
        id: false,
        allPath: 'PACKAGING.CODLIST.TITLE1'
      })
    });
  }

  scrollChange($event) {
    this.showNav = $event;
  }

  laneChange($event) {
    this.laneId = $event;
    this.changeLocationLists({
      index: this.selectedIndex
    });
  }

  createRack() {
    let dialogRef = this.dialog.open(AddLocationDialogComponent, {
      data: {
        warehouseId: this.warehouseId,
        laneList: this.lane,
        isEdit: false,
        isLaneEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isEdit == true) {
        this.changeLocationLists({index: this.selectedIndex});
      }
      if(dialogRef.componentInstance.data.isLaneEdit == true) {
        this.getAllLocationList(this.warehouseId);
      }
    });
  }

}
