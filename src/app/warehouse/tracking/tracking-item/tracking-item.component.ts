import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';

import { TrackingService } from '../tracking.service';
import { UserService } from  '../../../shared/services/user/user.service';
import { TrackingEditDialogComponent } from '../tracking-edit-dialog/tracking-edit-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-warehouse-tracking-item',
  templateUrl: './tracking-item.component.html',
  styleUrls: ['../_tracking.scss']
})

export class TrackingItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() product: any;
  @Input() index: number = 0;
  @Output() productChange = new EventEmitter<any>();

  currency: string = 'INR';
  isSuperuser: boolean = false;

  constructor(
    private adminService: TrackingService,
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

  edit() {
    let dialogRef = this.dialog.open(TrackingEditDialogComponent, {
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

  delete() {
    this.adminService.purchaseDelete({
      id: this.product.id
    }).then((data) => {
      this.productChange.emit({
        index: this.index,
        product : this.product,
        status: this.status,
        event: 'delete'
      });
    });
  }

  complete() {
    this.productChange.emit({
      index: this.index,
      product : this.product,
      status: this.status,
      event: 'complete'
    });
  }

}
