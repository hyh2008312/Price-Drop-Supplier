import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { Router, NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { CategoryService } from '../category.service';
import { UserService } from  '../../../shared/services/user/user.service';

import { saveAs } from 'file-saver';
import { AddCategoryDialogComponent } from '../add-category-dialog/add-category-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-category-main',
  templateUrl: './category-main.component.html',
  styleUrls: ['../_category.scss']
})

export class CategoryMainComponent implements OnInit {

  category: any = [];

  categoryList: any = [];
  subCategoryList: any = [];

  promoteAll: any;

  selectedIndex = 0;

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 50;
  pageSizeOptions = [50];

  constructor(
    private specificationService: CategoryService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {

  }

  ngOnInit():void {
  }

  ngOnDestroy() {

  }

  // MatPaginator Output
  changePage(event, type) {
    this.pageSize = event.pageSize;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  changeProducts($event) {

  }

}
