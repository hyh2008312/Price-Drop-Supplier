import { Input, Output, Component, OnInit, OnChanges, EventEmitter} from '@angular/core';

import { LocationService } from '../location.service';
import { LocationImageDialogComponent } from '../location-image-dialog/location-image-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ToolTipsComponent } from '../tool-tips/tool-tips.component';

@Component({
  selector: 'app-warehouse-location-item',
  templateUrl: './location-item.component.html',
  styleUrls: ['../_location.scss']
})

export class LocationItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() location: any;
  @Input() index: number = 0;
  @Output() productChange = new EventEmitter<any>();

  currency: string = 'INR';
  isSuperuser: boolean = false;
  isEdit: boolean = false;

  shelfQuantity: any;
  binQuantity: any;

  constructor(
    private locationService: LocationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if(!this.shelfQuantity) {
      this.shelfQuantity = this.location.shelfQuantity;
    }
    if(!this.binQuantity) {
      this.binQuantity = this.location.binQuantity;
    }
  }

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

  edit() {
    if(!this.isEdit) {
      this.isEdit = true;
    } else {
      this.locationService.editRack(this.location).then((data) => {
        this.location = data;
        this.isEdit = false;
      });
    }
  }

  shelfPlus() {
    this.location.shelfQuantity++;
  }

  shelfMinus() {
    this.location.shelfQuantity--;
  }

  binPlus() {
    this.location.binQuantity++;
  }

  binMinus() {
    this.location.binQuantity--;
  }


}
