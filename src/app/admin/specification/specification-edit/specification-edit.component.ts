import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';

import { SpecificationService } from '../specification.service';
import { ActivatedRoute} from '@angular/router';

import { AddCategoryAttributeDialogComponent} from '../add-category-attribute-dialog/add-category-attribute-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-specification-edit',
  templateUrl: './specification-edit.component.html',
  styleUrls: ['../_specification.scss']
})

export class SpecificationEditComponent implements OnInit {

  promoteAll: any;
  categoryName: any = '';
  attributeList: any = [];

  constructor(
    private adminService: SpecificationService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.getAttributeList();
    this.getProductDetail();
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {}

  getProductDetail() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.adminService.getCategoryAttributeDetail({
      id
    }).then((data) => {
      this.categoryName = data.grandParentName + (data.parentName ? ' > ' + data.parentName: '')
         + (data.childName ? ' > ' + data.childName: '');
      this.promoteAll = [...data.specificationList];
    });
  }

  getAttributeList() {
    this.adminService.getAttributeList().then((data) => {
      this.attributeList = [...data];
    });
  }

  addAttribute() {
    let dialogRef = this.dialog.open(AddCategoryAttributeDialogComponent, {
      data: {
        id: this.activatedRoute.snapshot.params['id'],
        isAddAttribute: false,
        attributeList: this.attributeList
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isAddAttribute) {
        this.getProductDetail();
      }
    });
  }

  productChange($event) {
    switch ($event.status) {
      case 1:
        if($event.event == 'delete') {
          this.promoteAll.splice($event.index,1);
        }
        break;
    }
  }

}
