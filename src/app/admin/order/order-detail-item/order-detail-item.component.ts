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
import { OverlayContainer } from '@angular/cdk/overlay';

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

  isShippingNumberEdit: boolean = false;
  isOrderCancel: boolean = false;

  currency:string = 'USD';

  totalAmount: number = 0;

  constructor(
    private adminService: AdminService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    overlayContainer: OverlayContainer
  ) {
    overlayContainer.getContainerElement().classList.add('unicorn-dark-theme');
  }

  ngOnInit(): void {

  }

  ngOnChanges() {
    if(this.order) {
      this.totalAmount = parseFloat(this.order.priceExclTax) + parseFloat(this.order.shippingExclTax);
    }
  }

  editTracking() {
    let dialogRef = this.dialog.open(AddTrackingInformationDialogComponent, {
      data: {
        order: this.order,
        isShippingNumberEdit: this.isShippingNumberEdit
      }
    });

    let self = this;

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isShippingNumberEdit == true) {
        self.productChange.emit({
          index: self.index,
          order: dialogRef.componentInstance.data.order,
          event: 'changeShippingNumber'
        });
      }
    });
  }

  cancelOrder() {
    let dialogRef = this.dialog.open(CancelOrderDialogComponent, {
      data: {
        order: this.order,
        isOrderCancel: this.isOrderCancel
      }
    });

    let self = this;

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isOrderCancel == true) {
        self.productChange.emit({
          index: self.index,
          order: dialogRef.componentInstance.data.order,
          event: 'cancelOrder'
        });
      }
    });
  }

  cancelFulfillment() {
    let dialogRef = this.dialog.open(CancelFulfillmentDialogComponent, {
      data: {
        order: this.order,
        isOrderCancel: this.isOrderCancel
      }
    });

    let self = this;

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isOrderCancel == true) {
        self.productChange.emit({
          index: self.index,
          order: dialogRef.componentInstance.data.order,
          event: 'cancelFulfillment'
        });
      }
    });
  }

  denyRequest() {
    let dialogRef = this.dialog.open(DenyRequestDialogComponent, {
      data: {
        order: this.order
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  authorizeReturn() {
    let dialogRef = this.dialog.open(AuthorizeReturnDialogComponent, {
      data: {
        order: this.order
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  shipExchangeItem() {
    let dialogRef = this.dialog.open(ShipExchangeItemDialogComponent, {
      data: {
        order: this.order
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  issueRefund() {
    let dialogRef = this.dialog.open(IssueRefundDialogComponent, {
      data: {
        order: this.order
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
