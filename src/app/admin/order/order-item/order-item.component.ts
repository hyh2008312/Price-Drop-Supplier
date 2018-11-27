import { Input, Output, Component, OnInit, EventEmitter} from '@angular/core';

import { OrderService } from '../order.service';
import { ApproveCancelDialogComponent } from '../approve-cancel-dialog/approve-cancel-dialog.component';
import { AddOrderStockDialogComponent } from '../add-order-stock-dialog/add-order-stock-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['../order.scss']
})

export class OrderItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() order: any;
  @Input() index: number = 0;
  @Output() productChange = new EventEmitter<any>();

  currency: string = 'INR';

  constructor(
    private adminService: OrderService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {


  }

  delete() {
    let self = this;


  }

  publish() {
    let self = this;


  }

  unpublish() {
    let self = this;


  }

  edit() {
    let tab = '';
    switch (this.status) {
      case 0:
        tab = 'publish';
        break;
      case 1:
        tab = 'draft';
        break;
      case 2:
        tab = 'unpublish';
        break;
    }
  }

  editSourcing() {
    let dialogRef = this.dialog.open(AddOrderStockDialogComponent, {
      data: {
        order: this.order,
        isOrderStockEdit: false
      }
    });

    let self = this;

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isOrderStockEdit == true) {
        self.order = dialogRef.componentInstance.data.order;
      }
    });
  }

  approveCancel() {
    let dialogRef = this.dialog.open(ApproveCancelDialogComponent, {
      data: {
        order: this.order,
        isOrderCancel: false
      }
    });

    let self = this;

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isOrderCancel == true) {
        self.productChange.emit({
          index: self.index,
          status: self.status,
          order: self.order,
          event: 'audit'
        });
      }
    });
  }
}
