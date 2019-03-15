import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { InventoryService } from '../inventory.service';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {ToolTipsComponent} from '../tool-tips/tool-tips.component';
import {utils, WorkBook, write} from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-warehouse-add-inventory-dialog',
  templateUrl: './export-restock-inventory-dialog.component.html',
  styleUrls: ['../_inventory.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'en'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})

export class ExportRestockInventoryDialogComponent implements OnInit {

  warehouseList: any;
  warehouseId: any = 2;

  psAll: any;
  peAll: any;

  constructor(
    public dialogRef: MatDialogRef<ExportRestockInventoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private inventoryService: InventoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getWarehouseList();
  }

  ngOnDestroy() {}

  close() {
    this.dialogRef.close();
  }

  openToast(str) {
    this.snackBar.openFromComponent(ToolTipsComponent, {
      data: str,
      duration: 1500,
      verticalPosition: 'top'
    });
  }

  export() {
    let start_time = this.psAll? this.psAll: null;
    let end_time = this.peAll? this.peAll: null;
    let warehouse_id = this.warehouseId? this.warehouseId: null;

    const ws_name = 'Inventory-Report';
    const wb: WorkBook = { SheetNames: [], Sheets: {} };
    let packing: any = [];
    let excel: any = [];
    this.inventoryService.getDownloadInventoryList({
      start_time,
      end_time,
      warehouse_id
    }).then((data) => {
      excel = [...data];

      for(let item of excel) {
        let orderItem: any = {};
        orderItem['Tracking No'] = item.trackNumber;
        orderItem['SKU'] = item.sku;
        orderItem['Title'] = item.title;
        orderItem['Color'] = item.color;
        orderItem['Size'] = item.size;
        orderItem['Quantity'] = item.quantity;
        orderItem['Original order ID'] = item.orderNumber;
        orderItem['Date of Inwarding'] = item.inwardDate? item.inwardDate.split("T")[0]: '';
        packing.push(orderItem);
      }

      const ws: any = utils.json_to_sheet(packing);
      wb.SheetNames.push(ws_name);
      wb.Sheets[ws_name] = ws;
      const wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

      let warehouseName = '';

      for(let item of this.warehouseList) {
        if(item.id == this.warehouseId) {
          warehouseName = item.warehouseName;
        }
      }

      saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), 'Inventory-' + warehouseName + '-Report-' +
        new Date().getUTCFullYear() + '-' + (new Date().getMonth() + 1 < 10? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) +
        '-' +(new Date().getDate() < 10? '0' + new Date().getDate() : new Date().getDate())
        + '.xlsx');

      this.openToast('Successfully Download');
    }).catch((res) => {
      this.openToast(res);
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

  getWarehouseList() {
    this.inventoryService.getWarehouseList().then((data) => {
      this.warehouseList = [...data];
    });
  }


  addEvent(type: any, event:MatDatepickerInputEvent<any>) {
    if(event.value) {
      this[type] = event.value._i.year + '-'+ (event.value._i.month+1) +'-'+event.value._i.date + ' 00:00:00';
    } else {
      this[type] = null;
    }
  }

}
