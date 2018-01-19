import { Input, Output, Component, OnInit, OnChanges, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { AdminService } from '../../admin.service';
import { UserService } from  '../../../shared/services/user/user.service';

import { AddTrackingInformationDialogComponent } from '../add-tracking-information-dialog/add-tracking-information-dialog.component';
import { CancelOrderDialogComponent } from '../cancel-order-dialog/cancel-order-dialog.component';
import { CancelFulfillmentDialogComponent } from '../cancel-fulfillment-dialog/cancel-fulfillment-dialog.component';
import { DenyRequestDialogComponent } from '../deny-request-dialog/deny-request-dialog.component';
import { AuthorizeReturnDialogComponent } from '../authorize-return-dialog/authorize-return-dialog.component';
import { ShipExchangeItemDialogComponent } from '../ship-exchange-item-dialog/ship-exchange-item-dialog.component';
import { IssueRefundDialogComponent } from '../issue-refund-dialog/issue-refund-dialog.component';

@Component({
  selector: 'app-order-detail-item',
  templateUrl: './order-detail-item.component.html',
  styleUrls: ['../order.scss']
})

export class OrderDetailItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() order: any;
  @Input() index: number = 0;
  @Output() productChange = new EventEmitter<any>();

  currency:string = 'USD';

  totalAmount: number = 0;

  constructor(
    private adminService: AdminService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  ngOnChanges() {
    if(this.order) {
      this.totalAmount = parseFloat(this.order.priceExclTax) + parseFloat(this.order.shippingExclTax);
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

  denyRequest() {
    let dialogRef = this.dialog.open(DenyRequestDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  authorizeReturn() {
    let dialogRef = this.dialog.open(AuthorizeReturnDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  shipExchangeItem() {
    let dialogRef = this.dialog.open(ShipExchangeItemDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  issueRefund() {
    let dialogRef = this.dialog.open(IssueRefundDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
