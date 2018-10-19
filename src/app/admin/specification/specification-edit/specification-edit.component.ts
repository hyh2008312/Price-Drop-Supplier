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
    const ws_name = 'Category-' + this.lastCategoryName;
    const ws_name1 = 'Template-' + this.lastCategoryName;
    const wb: WorkBook = { SheetNames: [], Sheets: {} };

    let tab1 = [
      "序号",
      "产品ID",
      "产品SPU",
      "主图链接",
      "变体ID",
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
      "Sale Price (Rs.)"
    ];
    let tab2 = [
      "Net Weight (kg)",
      "Shipping Weight (kg)",
      "长",
      "宽",
      "高",
      "Contain Battery (Y / N)",
      "Shipping Id",
      "Shipping Carrier",
      "shipping Time Min",
      "shipping Time Max",
      "Shipping Cost (Rs.)",
      "Country of Origin",
      "供应商ID",
      "供应商名称",
      "采购链接",
      "交货期",
      "最小起订量",
      "供应商所在地"
    ];

    let tabColumn = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    let tab3 = [];

    for(let item of this.promoteAll) {
      if(item.specificationCount > 1) {

        for(let i = 0; i < item.specificationCount; i++) {
          tab3.push(item.name);
        }
      } else {
        tab3.push(item.name);
      }
    }

    let table = tab1.concat(tab3).concat(tab2);

    let excel: any = [];

    excel.push(table);

    let excel1: any = [];

    excel1.push(['Attributes', 'Options']);

    this.adminService.getCategoryAttributeDetailList({
      categoryId: this.activatedRoute.snapshot.params['id'],
      page: 1,
      page_size: 100
    }).then((data) => {
      for(let i = 0; i < data.results.length; i++) {
        const item = data.results[i];
        for(let j = 0; j < item.variants.length; j++) {
          let columnNumber = 0;
          let costNumber = 0;
          const _itm = item.variants[j];
          let product: any = [];
          let indexNumber = i + j + 1;
          product.push(indexNumber);
          product.push(item.id);
          product.push(item.spu);
          product.push(_itm.mainImage);
          product.push(_itm.id);
          product.push(_itm.sku);
          columnNumber+=5;

          const attr = _itm.attributeValues;

          switch (attr.length) {
            case 0:
              product.push(null);
              product.push(null);
              product.push(null);
              product.push(null);
              columnNumber+=4;
              break;
            case 1:
              if(_itm.attributeValues[0].name == 'Size') {
                product.push(_itm.attributeValues[0].name);
                product.push(_itm.attributeValues[0].value);
                product.push(null);
                product.push(null);
                columnNumber+=4;
              } else {
                product.push(null);
                product.push(null);
                product.push(_itm.attributeValues[0].name);
                product.push(_itm.attributeValues[0].value);
                columnNumber+=4;
              }
              break;
            case 2:
              product.push(_itm.attributeValues[0].name);
              product.push(_itm.attributeValues[0].value);
              product.push(_itm.attributeValues[1].name);
              product.push(_itm.attributeValues[1].value);
              columnNumber+=4;
              break;
            default:
              product.push(null);
              product.push(null);
              product.push(null);
              product.push(null);
              columnNumber+=4;
              break;
          }

          product.push(_itm.stock);
          product.push(item.categories[0].fullName);
          product.push(null);
          product.push(item.chineseTitle);

          if(item.title) {
            product.push(item.title);
          } else {
            let title = '';
            for(let itm of this.promoteAll) {
              if(itm.specificationCount > 1) {
                for(let g = 0; g < item.productSpecification.length; g++) {
                  const specification = item.productSpecification[g];
                  const arr = specification.content.split(',');
                  for(let f = 0; f < arr.length; f++) {
                    title += arr[f];
                  }
                }

              } else {
                for(let g = 0; g < item.productSpecification.length; g++) {
                  const specification = item.productSpecification[g];
                  if(itm.name == specification.name) {
                    title += specification.value;
                  }
                }
              }
            }
            product.push(title);
          }

          columnNumber+=5;

          product.push(_itm.sourcingPrice? _itm.sourcingPrice: 0);
          columnNumber+=1;
          product.push(_itm.costPrice);
          let sourcingPrice = (Math.floor((columnNumber / (tabColumn.length - 1)) - 1) <= 0 ? '' : tabColumn[Math.floor((columnNumber / (tabColumn.length - 1)) - 1)]) + '' + tabColumn[columnNumber % (tabColumn.length - 1)];
          columnNumber+=1;
          costNumber = columnNumber;
          product.push(_itm.unitPrice);
          columnNumber+=1;
          product.push(_itm.saleUnitPrice);
          columnNumber+=1;

          for(let itm of this.promoteAll) {
            let isInTemplate = false;
            for (let g = 0; g < item.productSpecification.length; g++) {
              const specification = item.productSpecification[g];
              if (itm.name == specification.name) {
                isInTemplate = true;
                if(itm.specificationCount > 1) {
                  const arr = specification.content.split(',');
                  for(let f = 0; f < arr.length; f++) {
                    product.push(arr[f]);
                  }
                  for(let k = 0; k < itm.specificationCount - arr.length; k++) {
                    product.push(null);
                  }
                  columnNumber+=itm.specificationCount;
                } else {
                  product.push(specification.content);
                  columnNumber+=1;
                }
              }
            }
            if(!isInTemplate) {
              if(itm.specificationCount > 1) {
                for(let m = 0; m < itm.specificationCount; m++) {
                  product.push(null);
                }
                columnNumber+=itm.specificationCount;
              } else {
                product.push(null);
                columnNumber+=1;
              }
            }
          }

          product.push(item.weight);
          let netWeight = Math.floor((columnNumber / (tabColumn.length - 1)) - 1) < 0 ? '' : tabColumn[Math.floor((columnNumber / (tabColumn.length - 1)) - 1)] + '' + tabColumn[columnNumber % (tabColumn.length - 1)];
          columnNumber+=1;
          product.push(item.shippingWeight);
          let shippingWeight = Math.floor((columnNumber / (tabColumn.length - 1)) - 1) < 0 ? '' : tabColumn[Math.floor((columnNumber / (tabColumn.length - 1)) - 1)] + '' + tabColumn[columnNumber % (tabColumn.length - 1)];
          columnNumber+=1;
          product.push(item.length);
          let length = Math.floor((columnNumber / (tabColumn.length - 1)) - 1) < 0 ? '' : tabColumn[Math.floor((columnNumber / (tabColumn.length - 1)) - 1)] + '' + tabColumn[columnNumber % (tabColumn.length - 1)];
          columnNumber+=1;
          product.push(item.width);
          let width = Math.floor((columnNumber / (tabColumn.length - 1)) - 1) < 0 ? '' : tabColumn[Math.floor((columnNumber / (tabColumn.length - 1)) - 1)] + '' + tabColumn[columnNumber % (tabColumn.length - 1)];
          columnNumber+=1;
          product.push(item.height);
          let height = Math.floor((columnNumber / (tabColumn.length - 1)) - 1) < 0 ? '' : tabColumn[Math.floor((columnNumber / (tabColumn.length - 1)) - 1)] + '' + tabColumn[columnNumber % (tabColumn.length - 1)];
          columnNumber+=1;
          product.push(item.isBattery?'Y':'N');
          let isBattery = Math.floor((columnNumber / (tabColumn.length - 1)) - 1) < 0 ? '' : tabColumn[Math.floor((columnNumber / (tabColumn.length - 1)) - 1)] + '' + tabColumn[columnNumber % (tabColumn.length - 1)];
          columnNumber+=1;
          product.push(item.shipping.id);
          product.push(item.shipping.shippingName);
          product.push(item.shipping.shippingTimeMin);
          product.push(item.shipping.shippingTimeMax);
          columnNumber+=4;
          product.push({
            t: 'n',
            v: item.shipping.priceItem,
            f: 'IF(' + isBattery + (indexNumber + 1) + '="N",IF(' + shippingWeight + (indexNumber + 1) + '>' + length + (indexNumber + 1) + '*' + width + (indexNumber + 1) + '*' + height + (indexNumber + 1) + '/6000,' + shippingWeight + (indexNumber + 1) + ',' + length + (indexNumber + 1) + '*' + width + (indexNumber + 1) + '*' + height + (indexNumber + 1) + '/6000)*450+60,IF(' + shippingWeight + (indexNumber + 1) + '>' + length + (indexNumber + 1) + '*' + width + (indexNumber + 1) + '*' + height + (indexNumber + 1) + '/6000,' + shippingWeight + (indexNumber + 1) + ',' + length + (indexNumber + 1) + '*' + width + (indexNumber + 1) + '*' + height + (indexNumber + 1) + '/6000)*500+60)'
          });
          let shippingCost = Math.floor((columnNumber / (tabColumn.length - 1)) - 1) < 0 ? '' : tabColumn[Math.floor((columnNumber / (tabColumn.length - 1)) - 1)] + '' + tabColumn[columnNumber % (tabColumn.length - 1)];

          product[costNumber] = {
            t: 'n',
            v: _itm.costPrice,
            f: '' + sourcingPrice + (indexNumber + 1) + '*1.2+' + shippingCost + (indexNumber + 1)
          };

          product.push(item.originCountry.code);
          product.push(item.supplierId);
          product.push(item.supplierName);
          product.push(item.purchaseLink);
          product.push(item.processingTime);
          product.push(item.minimumQuantity);
          product.push(item.supplierLocation);

          excel.push(product);
        }

      }

      for(let itm of this.promoteAll) {
        let template = [];
        template.push(itm.name);

        const attrValues: any = itm.specificationValues ? itm.specificationValues.split(',') : [];

        for(let em of attrValues) {
          template.push(em);
        }
        excel1.push(template);

      }
      const ws: any = utils.json_to_sheet(excel, {skipHeader: true});
      const ws1: any = utils.json_to_sheet(excel1, {skipHeader: true});
      wb.SheetNames.push(ws_name);
      wb.SheetNames.push(ws_name1);
      wb.Sheets[ws_name] = ws;
      wb.Sheets[ws_name1] = ws1;

      const wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

      saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), `${this.lastCategoryName + '-' + new Date().getTime()}.xlsx`);

    });
  }

  s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }
}
