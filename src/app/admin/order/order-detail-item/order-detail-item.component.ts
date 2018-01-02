import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { AdminService } from '../../admin.service';
import { UserService } from  '../../../shared/services/user/user.service';

import { AddTrackingInformationDialogComponent } from '../add-tracking-information-dialog/add-tracking-information-dialog.component';
import { CancelOrderDialogComponent } from '../cancel-order-dialog/cancel-order-dialog.component';
import { CancelFulfillmentDialogComponent } from '../cancel-fulfillment-dialog/cancel-fulfillment-dialog.component';

@Component({
  selector: 'app-order-detail-item',
  templateUrl: './order-detail-item.component.html',
  styleUrls: ['../order.scss']
})

export class OrderDetailItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() order: any = {
    id : 457,
    imageUrl : "https://images-na.ssl-images-amazon.com/images/I/716Mg13ZLZL._SL1500_.jpg",
    productAmount: 10,
    shippingAmount: 8,
    taxAmount: 8,
    totalAmount: 36,
    title : "in-ear headset Ancoki  Apple earphones  Remote control perfect for iPhone 6s 6 Plus 5s 5 4s 4 SE 5C iPad 7 8 7s IOS S7 S6 Note 1 2 3  Tablet PC and Other Compatible Devices(2 PACK)",
    fulfillmentStatus: "Unfulfilled",
    paymentStatus: "Paid"
  };
  @Input() index: number = 0;
  @Output() productChange = new EventEmitter<any>();


  constructor(
    private adminService: AdminService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    if(this.status == 1) {
      this.order.fulfillmentStatus = 'Fulfilled';
      this.order.paymentStatus = 'Refunded';
    }
  }

  editTracking() {
    let dialogRef = this.dialog.open(AddTrackingInformationDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  cancelOrder() {
    let dialogRef = this.dialog.open(CancelOrderDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  cancelFulfillment() {
    let dialogRef = this.dialog.open(CancelFulfillmentDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
