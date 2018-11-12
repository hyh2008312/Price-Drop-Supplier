import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { utils, read, WorkBook, WorkSheet } from 'xlsx';
import {ProductService} from '../product.service';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product-add-upload-dialog',
  templateUrl: './add-upload-dialog.component.html',
  styleUrls: ['../product.scss']
})

export class AddUploadDialogComponent implements OnInit {

  newData: any;

  specificationList: any;

  error: any = false;

  constructor(
    public dialogRef: MatDialogRef<AddUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService: ProductService,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: WorkBook = read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.newData = <any[][]>(utils.sheet_to_json(ws, {header: 1}));

      const nameList = wsname.split('-');
      const id = nameList[nameList.length - 1];
      this.getProductDetail(id);

    };
    reader.readAsBinaryString(target.files[0]);
  }

  getProductDetail(id) {

    this.adminService.getCategoryAttributeDetail({
      id
    }).then((data) => {
      this.specificationList = [...data.specificationList];

      let excelObject: any = {};

      for(let i = 0; i < this.newData.length; i++) {
        const item = this.newData[i];
        if(i == 0) {
          let specIndex = 19;
          for(let itm of this.specificationList) {
            if(itm.specificationCount > 0) {
              for(let j = 0; j < itm.specificationCount; j++) {

                if(item[specIndex + j] != itm.name) {
                  return this.error = 'Template is not the newest, please update you template!';
                }
              }
              specIndex += itm.specificationCount;
            } else {
              if(item[specIndex] != itm.name) {
                return this.error = 'Template is not the newest, please update you template!';
              }
              specIndex++;
            }
          }
        } else {
          if(item[1] != '') {
            if(!excelObject[item[1]]) {
              excelObject[item[1]] = {};
            }
            excelObject[item[1]].id = item[1] || '';
            excelObject[item[1]].spu = item[2] || '';
            excelObject[item[1]].title = item[14] || '';
            excelObject[item[1]].chineseTitle = item[13] || '';
            excelObject[item[1]].shippingWeight = item[item.length - 17] || '';
            excelObject[item[1]].processingTime = item[item.length - 3] || '';
            excelObject[item[1]].supplierLocation = item[item.length - 1] || '';
            excelObject[item[1]].minimumQuantity = item[item.length - 2] || '';
            excelObject[item[1]].width = item[item.length - 15] || '';
            excelObject[item[1]].length = item[item.length - 16] || '';
            excelObject[item[1]].height = item[item.length - 14] || '';
            excelObject[item[1]].weight = item[item.length - 18] || '';
            excelObject[item[1]].shopName = item[item.length - 5] || '';
            excelObject[item[1]].supplierId = item[item.length - 6] || '';
            excelObject[item[1]].purchaseLink = item[item.length - 4] || '';
            excelObject[item[1]].isBattery = item[item.length - 13] == 'N' ? false: true;
            excelObject[item[1]].code = item[item.length - 7] || '';

            if(!excelObject[item[1]].variants) {
              excelObject[item[1]].variants = [];
            }

            let variant: any = {
              attributeValues: [],
              id: item[4],
              sku: item[5],
              unitPrice: item[18],
              stock: item[10],
              costPrice: item[16],
              saleUnitPrice: item[17],
              sourcingPrice: item[15]
            };

            if(item[6]) {
              variant.attributeValues.push({
                name: item[6]?item[6]:'',
                value: item[7]?item[7]:'',
                attributeId: 1
              });
            }
            if(item[8]) {
              variant.attributeValues.push({
                name: item[8]?item[8]:'',
                value: item[9]? item[9]: '',
                attributeId: 2
              });
            }

            excelObject[item[1]].variants.push(variant);

            if(!excelObject[item[1]].productSpecification) {
              excelObject[item[1]].productSpecification = [];
              let index = 19;
              for(let itm of this.specificationList) {
                let specification: any = {};
                specification.name = itm.name;
                let content = '';
                for(let j = 0; j < itm.specificationCount; j++) {
                  if(item[index] != '') {
                    if(j == 0) {
                      content += item[index];
                    } else {
                      content += ',' + item[index];
                    }
                  }
                  index++;
                }
                specification.content = content;
                specification.sort = itm.sort;
                specification.specificationId = itm.specificationId;
                excelObject[item[1]].productSpecification.push(specification);
              }

            }

            excelObject[item[1]].shipping = {};
            excelObject[item[1]].shipping.id = item[item.length - 12];
            excelObject[item[1]].shipping.priceItem = item[item.length - 8];
            excelObject[item[1]].shipping.shippingTimeMin = item[item.length - 10];
            excelObject[item[1]].shipping.shippingTimeMax = item[item.length - 9];
            excelObject[item[1]].shipping.shippingName = item[item.length - 11];
          }
        }
      }

      let excel: any = [];
      for(let item in excelObject) {
        excel.push(excelObject[item]);
      }

      this.adminService.uploadEditedProduct({product: excel}).then(() => {
        this.data.isUpload = true;
        this.close();
      });

    });
  }


}
