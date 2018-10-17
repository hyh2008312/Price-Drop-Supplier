import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';

import { SpecificationService } from '../specification.service';
import { ActivatedRoute} from '@angular/router';

import { AddCategoryAttributeDialogComponent} from '../add-category-attribute-dialog/add-category-attribute-dialog.component';
import {MatDialog} from '@angular/material';

import { utils, write, WorkBook } from 'xlsx';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-specification-edit',
  templateUrl: './specification-edit.component.html',
  styleUrls: ['../_specification.scss']
})

export class SpecificationEditComponent implements OnInit {

  promoteAll: any;
  categoryName: any = '';
  lastCategoryName: any = '';
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
      if(data.childName) {
        this.lastCategoryName = data.childName;
      } else {
        this.lastCategoryName = data.parentName;
      }
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
        if($event.event == 'edit') {
          this.promoteAll[$event.index] = $event.item;
        }
        break;
    }
  }

  export(): void {
    const ws_name = this.lastCategoryName + ' Template';
    const wb: WorkBook = { SheetNames: [], Sheets: {} };
    let excel: any = [
      [
        "序号",
        "产品ID",
        "主图链接",
        "SKU",
        "变体1名称",
        "变体值",
        "变体2名称",
        "变体值",
        "库存数量",
        "产品基础分类",
        "产品CMS分类",
        "产品中文名称",
        "产品英文名称",
        "采购价 (Rs.)",
        "Cost Price (Rs.)",
        "MRP (Rs.)",
        "Sale Price (Rs.)",
        "Net Weight (kg)",
        "Shipping Weight (kg)",
        "长",
        "宽",
        "高",
        "Contain Battery (Y / N)",
        "Shipping Carrier",
        "Shipping Time",
        "Shipping Cost (Rs.)",
        "Country of Origin",
        "供应商ID",
        "供应商名称",
        "采购链接",
        "交货期",
        "最小起订量",
        "供应商所在地"
      ]
    ];

    let startIndex = 16;

    for(let item of this.attributeList) {
      excel[0].splice(startIndex, 1, item);
      startIndex++;
    }



    const ws: any = utils.json_to_sheet(excel);
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

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), `${this.categoryName}.xlsx`);

  }

}
