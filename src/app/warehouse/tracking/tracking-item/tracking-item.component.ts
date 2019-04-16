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
import { ConfirmNotFoundDialogComponent } from '../confirm-not-found-dialog/confirm-not-found-dialog.component';
import { PackingDeleteDialogComponent } from '../packing-delete-dialog/packing-delete-dialog.component';
import { TranslateService } from '@ngx-translate/core';

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
    private snackBar: MatSnackBar,
    private trans: TranslateService
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
      title = 'PACKAGING.DIALOG4.TITLE1';
      content = 'PACKAGING.DIALOG4.TITLE2';
    } else if(this.product.pickStatus == 'Package Deleted' || this.product.pickStatus == 'Not Found') {
      title = 'PACKAGING.DIALOG4.TITLE3';
      content = 'PACKAGING.DIALOG4.TITLE4';
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
    let button = 'PACKAGING.DIALOG2.BUTTON1';
    let quantity = 0;
    let red = false;
    for(let item of this.product.pickVariants) {
      quantity += item.quantity;
    }
    if(this.product.pickStatus == 'Pending Packaging' || this.product.pickStatus == 'Not Found') {
      title = 'PACKAGING.DIALOG2.TITLE1';
      if(quantity == 1) {
        content = 'PACKAGING.DIALOG2.TITLE2';
      } else {
        content = 'PACKAGING.DIALOG2.TITLE3';
        button = 'PACKAGING.DIALOG2.TITLE4';
        red = true;
      }
    } else if(this.product.pickStatus == 'Packaging Completed') {
      title = 'PACKAGING.DIALOG2.TITLE5';
      content = 'PACKAGING.DIALOG2.TITLE6？';
    }
    let dialogRef = this.dialog.open(ConfirmPackageDialogComponent, {
      data: {
        item: this.product,
        isEdit: false,
        title,
        content,
        button,
        red
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

  notFountStatus() {
    let title = '';
    let content = '';
    if(this.product.pickStatus == 'Pending Packaging') {
      title = 'PACKAGING.DIALOG3.TITLE1';
      content = 'PACKAGING.DIALOG3.TITLE2';
    }

    let dialogRef = this.dialog.open(ConfirmNotFoundDialogComponent, {
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

  assignToChineseSourcing() {

    let dialogRef = this.dialog.open(PackingDeleteDialogComponent, {
      data: {
        item: this.product,
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isEdit == true) {
        this.productChange.emit({
          index: this.index,
          product: this.product,
          status: this.status,
          event: 'remove'
        });
      }
    });
  }

  openNotesDialog() {

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

  getLangs() {
    if(this.trans.currentLang == 'en') {
      return 'Asia/Kolkata';
    } else {
      return 'Asia/Shanghai';
    }
  }

}
