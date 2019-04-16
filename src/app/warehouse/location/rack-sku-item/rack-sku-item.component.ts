import { Input, Output, Component, OnInit, EventEmitter} from '@angular/core';

import { LocationService } from '../location.service';
import { LocationImageDialogComponent } from '../location-image-dialog/location-image-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ToolTipsComponent } from '../tool-tips/tool-tips.component';

@Component({
  selector: 'app-warehouse-rack-sku-item',
  templateUrl: './rack-sku-item.component.html',
  styleUrls: ['../_location.scss']
})

export class RackSkuItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() location: any;
  @Input() index: number = 0;
  @Output() productChange = new EventEmitter<any>();

  currency: string = 'INR';
  isSuperuser: boolean = false;
  constructor(
    private locationService: LocationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  openLargeImage(data) {
    let dialogRef = this.dialog.open(LocationImageDialogComponent, {
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
