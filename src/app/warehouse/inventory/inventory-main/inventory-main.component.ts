import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { InventoryService } from '../inventory.service';
import { UserService } from  '../../../shared/services/user/user.service';
import {MatDialog} from '@angular/material';

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
    private adminService: InventoryService,
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
    this.changeInventoryLists({index: this.selectedIndex});
  }

  changeInventoryLists($event) {

  }


}
