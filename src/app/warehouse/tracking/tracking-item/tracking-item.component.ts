import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';

import { TrackingService } from '../tracking.service';
import { UserService } from  '../../../shared/services/user/user.service';
import { TrackingEditDialogComponent } from '../tracking-edit-dialog/tracking-edit-dialog.component';
import { ToolTipsComponent } from '../tool-tips/tool-tips.component';
import { TrackingImageDialogComponent } from '../tracking-image-dialog/tracking-image-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddNotesDialogComponent } from '../add-notes-dialog/add-notes-dialog.component';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmPackageDialogComponent } from '../confirm-package-dialog/confirm-package-dialog.component';

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
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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
    let title = '';
    let content = '';
    if(this.product.pickStatus == 'Pending Packaging' || this.product.pickStatus == 'Packaging Completed') {
      title = '确认删除';
      content = '是否确认删除？';
    } else if(this.product.pickStatus == 'Package Deleted') {
      title = '取消删除';
      content = '是否取消删除？';
    }
    let dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        item: this.product,
        isEdit: false,
        title,
        content
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isEdit == true) {
        if(this.status == 0) {
          this.product = dialogRef.componentInstance.data.item;
        } else {
          this.productChange.emit({
            index: this.index,
            product : this.product,
            status: this.status,
            event: 'delete'
          });
        }

      }
    });

  }

  changeStatus() {
    let title = '';
    let content = '';
    if(this.product.pickStatus == 'Pending Packaging') {
      title = '已打包出库';
      content = '是否确认已打包出库？';
    } else if(this.product.pickStatus == 'Packaging Completed') {
      title = '取消打包出库';
      content = '是否取消打包出库？';
    }
    let dialogRef = this.dialog.open(ConfirmPackageDialogComponent, {
      data: {
        item: this.product,
        isEdit: false,
        title,
        content
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isEdit == true) {
        this.product = dialogRef.componentInstance.data.item;
        this.productChange.emit({
          index: this.index,
          product: this.product,
          status: this.status,
          event: 'change'
        });

      }
    });
  }

  openNotesDialog() {
    console.log(this.product);

    let dialogRef = this.dialog.open(AddNotesDialogComponent, {
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

  openLargeImage(data) {
    let dialogRef = this.dialog.open(TrackingImageDialogComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  copy($event) {
    this.openCopyBar();
  }

  openCopyBar() {
    this.snackBar.openFromComponent(ToolTipsComponent, {
      data: 'Successfully Copied!',
      duration: 1500,
      verticalPosition: 'top'
    });
  }

}
