 import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder } from '@angular/forms';

import { OrderService } from '../order.service';
 import { ToolTipsComponent } from '../tool-tips/tool-tips.component';
 import { read, utils, WorkBook, WorkSheet } from 'xlsx';

@Component({
  selector: 'app-warehouse-order-upload-order-dialog',
  templateUrl: './upload-order-dialog.component.html',
  styleUrls: ['../_order.scss']
})

export class UploadOrderDialogComponent implements OnInit {

  isLoading: boolean = false;
  color: any = 'accent';
  mode: any = 'indeterminate';
  value: any = 30;

  constructor(
    public dialogRef: MatDialogRef<UploadOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {

  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  uploadGlowRoad(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: WorkBook = read(bstr, {type: 'binary'});


      this.getSheets(wb);

    };
    reader.readAsBinaryString(target.files[0]);
  }



  getSheets(wb) {
    const wsname: string = wb.SheetNames[0];
    const ws: WorkSheet = wb.Sheets[wsname];

    /* save data */
    const newData: any = <any[][]>(utils.sheet_to_json(ws, {header: 1}));

    let orders = {};
    for(let i = 0; i < newData.length; i++) {
      const item = newData[i];
      if(i > 0) {
        if(!orders[item[0]]) {
          orders[item[0]] = {};
          orders[item[0]].thirdOrderNumber = item[0];
          orders[item[0]].thirdPartyId = 3;
          orders[item[0]].orderData = [];
          orders[item[0]].orderData.push({
            sku: item[4],
            quantity: 1,
            amount: item[7]
          });
        } else {
          orders[item[0]].orderData.push({
            sku: item[4],
            quantity: 1,
            amount: item[7]
          });
        }
      }
    }

    let data = [];
    for(let k in orders) {
      data.push(orders[k]);
    }

    this.createGlowRoadOrder(data);

  }

  createGlowRoadOrder(orders) {
    this.isLoading = true;
    this.orderService.createOrders({orders}).then((data) => {
      this.isLoading = false;
      this.data.isEdit = true;
      this.openSnackBar('GlowRoad orders are successfully saved');
      this.close();
    }).catch((res) => {
      this.isLoading = false;
      this.openSnackBar('Some Error');
    });
  }

  uploadMeesho(evt: any) {

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: WorkBook = read(bstr, {type: 'binary'});


      this.getSheets1(wb);

    };
    reader.readAsBinaryString(target.files[0]);
  }

  getSheets1(wb) {
    const wsname: string = wb.SheetNames[0];
    const ws: WorkSheet = wb.Sheets[wsname];

    /* save data */
    const newData: any = <any[][]>(utils.sheet_to_json(ws, {header: 1}));

    let orders = {};
    for(let i = 0; i < newData.length; i++) {
      const item = newData[i];
      if(i > 0) {
        if(item[0] && item[0] != '') {
          const thirdOrderId = item[0];
          if(!orders[thirdOrderId]) {

            orders[thirdOrderId] = {};
            orders[thirdOrderId].thirdOrderNumber = thirdOrderId;
            orders[thirdOrderId].thirdPartyId = 2;
            orders[thirdOrderId].trackingNumber = item[10];
            orders[thirdOrderId].custName = item[2];
            orders[thirdOrderId].custAddress = item[3];
            orders[thirdOrderId].orderData = [];
            orders[thirdOrderId].orderData.push({
              sku: item[5].split('_')[0],
              quantity: parseInt(item[8]),
              amount: item[9]
            });
          } else {
            orders[thirdOrderId].orderData.push({
              sku: item[5].split('_')[0],
              quantity: parseInt(item[8]),
              amount: item[9]
            });
          }
        }
      }
    }

    let data = [];
    for(let k in orders) {
      data.push(orders[k]);
    }

    this.createMeeshoOrder(data);

  }

  createMeeshoOrder(orders) {
    this.isLoading = true;
    this.orderService.createMeeshoOrders({orders}).then((data) => {
      this.isLoading = false;
      this.data.isEdit = true;
      this.openSnackBar('Meesho orders are successfully saved.');
      this.close();
    }).catch((res) => {
      this.isLoading = false;
      this.openSnackBar('Some Error');
    });
  }

  uploadChapman(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: WorkBook = read(bstr, {type: 'binary'});


      this.getSheets3(wb);

    };
    reader.readAsBinaryString(target.files[0]);
  }

  getSheets3(wb) {
    const wsname: string = wb.SheetNames[0];
    const ws: WorkSheet = wb.Sheets[wsname];

    /* save data */
    const newData: any = <any[][]>(utils.sheet_to_json(ws, {header: 1}));

    let data = [];
    for(let i = 0; i < newData.length; i++) {
      const item = newData[i];
      if(i > 0) {
        if(item[0] && item[0] != '') {
          data.push({
            sku: item[3],
            quantity: parseInt(item[4]),
            amount: item[8]
          });
        }
      }
    }

    this.createChapmanOrder(data);

  }

  createChapmanOrder(orders) {
    this.isLoading = true;
    this.orderService.createChapmanOrders({
      channelId: 5,
      orders
    }).then((data) => {
      this.isLoading = false;
      this.data.isEdit = true;
      this.openSnackBar('Chapman orders are successfully saved.');
      this.close();
    }).catch((res) => {
      this.isLoading = false;
      this.openSnackBar('Some Error');
    });
  }

  uploadZoomtail(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: WorkBook = read(bstr, {type: 'binary'});

      this.getSheets4(wb);

    };
    reader.readAsBinaryString(target.files[0]);
  }

  getSheets4(wb) {
    const wsname: string = wb.SheetNames[0];
    const ws: WorkSheet = wb.Sheets[wsname];

    /* save data */
    const newData: any = <any[][]>(utils.sheet_to_json(ws, {header: 1}));

    let data = [];
    for(let i = 0; i < newData.length; i++) {
      const item = newData[i];
      if(i > 0) {
        if(item[0] && item[0] != '') {
          data.push({
            sku: item[4],
            quantity: parseInt(item[10]),
            amount: item[6]
          });
        }
      }
    }

    this.createZoomtailOrders(data);

  }

  createZoomtailOrders(orders) {
    this.isLoading = true;
    this.orderService.createZoomtailOrders({
      channelId: 4,
      orders
    }).then((data) => {
      this.isLoading = false;
      this.data.isEdit = true;
      this.openSnackBar('Zoomtail orders are successfully saved.');
      this.close();
    }).catch((res) => {
      this.isLoading = false;
      this.openSnackBar('Some Error');
    });
  }

  openSnackBar(str) {
    this.snackBar.openFromComponent(ToolTipsComponent, {
      data: str,
      duration: 4000,
      verticalPosition: 'top'
    });
  }

}
