import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { InventoryService } from '../inventory.service';
import { ToolTipsComponent } from '../tool-tips/tool-tips.component';

@Component({
  selector: 'app-warehouse-add-inventory-dialog',
  templateUrl: './add-inventory-dialog.component.html',
  styleUrls: ['../_inventory.scss']
})

export class AddInventoryDialogComponent implements OnInit {

  searchType = 'track_number';
  searchTypeList = [{
    text: 'ORDERS.SEARCHTYPELIST.TITLE1',
    value: 'order_number'
  }, {
    text: 'ORDERS.SEARCHTYPELIST.TITLE2',
    value: 'track_number'
  }];
  searchKey: any;

  products: any = [];

  warehouseList: any;
  warehouseId: any = 2;

  constructor(
    public dialogRef: MatDialogRef<AddInventoryDialogComponent>,
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

  changeProducts(event) {
    const search = this.searchKey && this.searchKey != ''? this.searchKey: null;
    let order_type: any = null;
    if(search) {
      order_type = this.searchType;
    }

    this.inventoryService.getOrderList({
      search,
      order_type
    }).then((data) => {
      this.products = [];
      for(let item of data) {
        const _im: any = item;
        _im.receiveQuantity = item.quantity;
        this.products.push(_im);
      }

    });
  }

  productChange(event) {}

  addProduct() {
    let params: any = {};
    params.content = [];
    for(let item of this.products) {
      params.content.push({
        id: item.orderId,
        quantity: item.receiveQuantity
      })
    }
    params.warehouseId = this.warehouseId;
    this.inventoryService.addInventory(params).then(() => {
      this.data.isEdit = true;
      this.openToast('Successfully Saved!');
      this.close();
    }).then(() => {
      this.openToast('Some Error!');
    });
  }

  getWarehouseList() {
    this.inventoryService.getWarehouseList().then((data) => {
      this.warehouseList = [...data];
    });
  }
}
