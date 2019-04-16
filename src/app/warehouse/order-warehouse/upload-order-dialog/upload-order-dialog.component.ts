import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder } from '@angular/forms';

import { OrderService } from '../order.service';
 import { ToolTipsComponent } from '../tool-tips/tool-tips.component';
 import {read, utils, WorkBook, WorkSheet, write} from 'xlsx';

import { saveAs } from 'file-saver';

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

  error: any;

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

  uploadShop101(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: WorkBook = read(bstr, {type: 'binary'});


      this.getSheetsShop101(wb);

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
            sku: item[5],
            quantity: 1,
            amount: item[8]
          });
        } else {
          orders[item[0]].orderData.push({
            sku: item[5],
            quantity: 1,
            amount: item[8]
          });
        }
      }
    }

    let data = [];
    for(let k in orders) {
      data.push(orders[k]);
    }

    let cutArray = [];
    let len = Math.ceil(data.length / 50);
    for(let i = 0; i < len; i++) {
      if(i < len - 1) {
        cutArray.push(data.slice(i * 50, (i + 1) * 50));
      } else {
        cutArray.push(data.slice(i * 50, data.length));
      }
    }

    let i = 0;

    this.createGlowRoadOrder(cutArray, i, 'GlowRoad');

  }

  getSheetsShop101(wb) {
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
          orders[item[0]].thirdPartyId = 1;
          orders[item[0]].orderData = [];
          orders[item[0]].orderData.push({
            sku: item[5],
            quantity: parseInt(item[2]),
            amount: item[4]
          });
        } else {
          orders[item[0]].orderData.push({
            sku: item[5],
            quantity: parseInt(item[2]),
            amount: item[4]
          });
        }
      }
    }

    let data = [];
    for(let k in orders) {
      data.push(orders[k]);
    }

    let cutArray = [];
    let len = Math.ceil(data.length / 50);
    for(let i = 0; i < len; i++) {
      if(i < len - 1) {
        cutArray.push(data.slice(i * 50, (i + 1) * 50));
      } else {
        cutArray.push(data.slice(i * 50, data.length));
      }
    }

    let i = 0;

    this.createGlowRoadOrder(cutArray, i, 'Shop101');

  }

  createGlowRoadOrder(orders, i, name) {
    if(i > orders.length - 1) {
      this.isLoading = false;
      this.data.isEdit = true;
      this.openSnackBar(name + ' orders are successfully saved.');
      this.export(name);

      this.orderService.formatOrder();
      return;
    }
    this.isLoading = true;
    this.orderService.createOrders({orders: orders[i]}).then((data) => {
      if(i == 0) {
        this.error = [];
      }
      i++;
      for(let item of data.data) {
        this.error.push(item);
      }
      this.createGlowRoadOrder(orders, i, name);
    }).catch((res) => {
      i++;
      this.createGlowRoadOrder(orders, i, name);
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

  uploadJMDMeesho(evt: any) {

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: WorkBook = read(bstr, {type: 'binary'});


      this.getSheetsJMDMeesho(wb);

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
            orders[thirdOrderId].trackingNumber = item[11];
            orders[thirdOrderId].custName = item[2];
            orders[thirdOrderId].custAddress = item[3];
            orders[thirdOrderId].orderData = [];
            orders[thirdOrderId].orderData.push({
              sku: item[6],
              quantity: parseInt(item[9]),
              amount: item[10]
            });
          } else {
            orders[thirdOrderId].orderData.push({
              sku: item[6],
              quantity: parseInt(item[9]),
              amount: item[10]
            });
          }
        }
      }
    }

    let data = [];
    for(let k in orders) {
      data.push(orders[k]);
    }

    let cutArray = [];
    let len = Math.ceil(data.length / 50);
    for(let i = 0; i < len; i++) {
      if(i < len - 1) {
        cutArray.push(data.slice(i * 50, (i + 1) * 50));
      } else {
        cutArray.push(data.slice(i * 50, data.length));
      }
    }

    let i = 0;
    this.createMeeshoOrder(cutArray, i, 'Meesho');

  }

  getSheetsJMDMeesho(wb) {
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
            orders[thirdOrderId].custName = item[2];
            orders[thirdOrderId].custAddress = item[3];
            orders[thirdOrderId].orderData = [];
            orders[thirdOrderId].orderData.push({
              sku: item[4],
              quantity: parseInt(item[7]),
              amount: item[8]
            });
          } else {
            orders[thirdOrderId].orderData.push({
              sku: item[4],
              quantity: parseInt(item[7]),
              amount: item[8]
            });
          }
        }
      }
    }

    let data = [];
    for(let k in orders) {
      data.push(orders[k]);
    }

    let cutArray = [];
    let len = Math.ceil(data.length / 50);
    for(let i = 0; i < len; i++) {
      if(i < len - 1) {
        cutArray.push(data.slice(i * 50, (i + 1) * 50));
      } else {
        cutArray.push(data.slice(i * 50, data.length));
      }
    }

    let i = 0;
    this.createJMDMeeshoOrder(cutArray, i, 'JMD Meesho');

  }

  createMeeshoOrder(orders, i, name) {
    if(i > orders.length - 1) {
      this.isLoading = false;
      this.data.isEdit = true;
      this.openSnackBar(name + ' orders are successfully saved.');
      this.export(name);
      return;
    }
    this.isLoading = true;
    this.orderService.createMeeshoOrders({orders: orders[i]}).then((data) => {
      if(i == 0) {
        this.error = [];
      }
      i++;
      for(let item of data.data) {
        this.error.push(item);
      }
      this.createMeeshoOrder(orders, i, name);
    }).catch((res) => {
      i++;
      this.createMeeshoOrder(orders, i, name);
      this.openSnackBar('Some Error');
    });
  }

  createJMDMeeshoOrder(orders, i, name) {
    if(i > orders.length - 1) {
      this.isLoading = false;
      this.data.isEdit = true;
      this.openSnackBar(name + ' orders are successfully saved.');
      this.export(name);
      return;
    }
    this.isLoading = true;
    this.orderService.createJMDMeeshoOrders({orders: orders[i]}).then((data) => {
      if(i == 0) {
        this.error = [];
      }
      i++;
      for(let item of data.data) {
        this.error.push(item);
      }
      this.createJMDMeeshoOrder(orders, i, name);
    }).catch((res) => {
      i++;
      this.createJMDMeeshoOrder(orders, i, name);
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
            sku: item[0],
            quantity: parseInt(item[1]),
            amount: item[2]
          });
        }
      }
    }

    let cutArray = [];
    let len = Math.ceil(data.length / 50);
    for(let i = 0; i < len; i++) {
      if(i < len - 1) {
        cutArray.push(data.slice(i * 50, (i + 1) * 50));
      } else {
        cutArray.push(data.slice(i * 50, data.length));
      }
    }

    let i = 0;

    this.createChapmanOrder(cutArray, i, 'Chapman');

  }

  createChapmanOrder(orders, i, name) {
    if(i > orders.length - 1) {
      this.isLoading = false;
      this.data.isEdit = true;
      this.openSnackBar('Chapman orders are successfully saved.');
      this.export(name);
      return;
    }

    this.isLoading = true;
    this.orderService.createChapmanOrders({
      channelId: 5,
      orders: orders[i]
    }).then((data) => {
      if(i == 0) {
        this.error = [];
      }
      i++;
      for(let item of data.data) {
        this.error.push(item);
      }
      this.createChapmanOrder(orders, i, name);
    }).catch((res) => {
      i++;
      this.createChapmanOrder(orders, i, name);
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

    let cutArray = [];
    let len = Math.ceil(data.length / 50);
    for(let i = 0; i < len; i++) {
      if(i < len - 1) {
        cutArray.push(data.slice(i * 50, (i + 1) * 50));
      } else {
        cutArray.push(data.slice(i * 50, data.length));
      }
    }

    let i = 0;

    this.createZoomtailOrders(data, i, 'Zoomtail');

  }

  createZoomtailOrders(orders, i, name) {
    if(i > orders.length - 1) {
      this.isLoading = false;
      this.data.isEdit = true;
      this.openSnackBar('Zoomtail orders are successfully saved.');
      this.export(name);
      return;
    }

    this.isLoading = true;
    this.orderService.createZoomtailOrders({
      channelId: 4,
      orders: orders[i]
    }).then((data) => {
      if(i == 0) {
        this.error = [];
      }
      i++;
      for(let item of data.data) {
        this.error.push(item);
      }
      this.createZoomtailOrders(orders, i, name);
    }).catch((res) => {
      i++;
      this.createZoomtailOrders(orders, i, name);
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

  export(name) {
    if(!this.error || this.error.length == 0) {
      return;
    }
    const ws_name = name;
    const wb: WorkBook = { SheetNames: [], Sheets: {} };
    let packing: any = [];
    let excel: any = this.error;

    for(let item of excel) {
      let orderItem: any = {};
      orderItem.third_party_order_id = item.thirdOrderNumber;
      orderItem.sku = item.sku;
      orderItem.reason = item.reason;
      packing.push(orderItem);
    }

    const ws: any = utils.json_to_sheet(packing);
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    const wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });


    saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), ws_name+'-Cancel-' + new Date().getUTCFullYear() + '-' + (new Date().getMonth() + 1 < 10? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) +
      '-' +(new Date().getDate() < 10? '0' + new Date().getDate() : new Date().getDate()) +'.xlsx');

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
