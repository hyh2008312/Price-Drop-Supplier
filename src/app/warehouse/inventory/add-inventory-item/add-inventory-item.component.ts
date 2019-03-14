import { Input, Output, Component, OnInit,EventEmitter, OnChanges} from '@angular/core';

import { InventoryService } from '../inventory.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ToolTipsComponent } from '../tool-tips/tool-tips.component';

@Component({
  selector: 'app-warehouse-add-inventory-item',
  templateUrl: './add-inventory-item.component.html',
  styleUrls: ['../_inventory.scss']
})

export class AddInventoryItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() product: any;
  @Input() index: number = 0;
  @Output() productChange = new EventEmitter<any>();

  currency: string = 'INR';
  isSuperuser: boolean = false;
  isShow: boolean = false;

  constructor(
    private inventoryService: InventoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}


  ngOnInit(): void {}

  openLargeImage() {
    this.isShow = !this.isShow;
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
