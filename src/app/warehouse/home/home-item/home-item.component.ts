import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';

import { HomeService } from '../home.service';
import { UserService } from  '../../../shared/services/user/user.service';
import { OrderDetailDialogComponent } from '../order-detail-dialog/order-detail-dialog.component';
import { HomeEditDialogComponent } from '../home-edit-dialog/home-edit-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-warehouse-home-item',
  templateUrl: './home-item.component.html',
  styleUrls: ['../_home.scss']
})

export class HomeItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() product: any;
  @Input() index: number = 0;
  @Output() productChange = new EventEmitter<any>();

  currency: string = 'INR';
  isSuperuser: boolean = false;

  constructor(
    private adminService: HomeService,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.userService.currentUser.subscribe((data) => {
      if(data) {
        if(data.isStaff && data.isSuperuser) {
          this.isSuperuser = true
        }
      }
    });
  }

  ngOnInit(): void {


  }

  trackingPackage() {
    let dialogRef = this.dialog.open(OrderDetailDialogComponent, {
      data: {
        trackingNumber: this.product.logisticsId
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  orderDetails() {
    let dialogRef = this.dialog.open(OrderDetailDialogComponent, {
      data: {
        purchaseId: this.product.purchaseId
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  edit() {
    let dialogRef = this.dialog.open(OrderDetailDialogComponent, {
      data: {
        item: this.product,
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isEdit == true) {
        this.product = dialogRef.componentInstance.data.item;
      }
    });
  }

}
