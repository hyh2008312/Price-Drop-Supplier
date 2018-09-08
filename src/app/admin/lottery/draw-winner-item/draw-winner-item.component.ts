import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';

import { LotteryService } from '../lottery.service';
import {AddTrackingInformationDialogComponent} from '../add-tracking-information-dialog/add-tracking-information-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-lottery-draw-winner-item',
  templateUrl: './draw-winner-item.component.html',
  styleUrls: ['../_lottery.scss']
})

export class DrawWinnerItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() promote: any = {};
  @Input() promoteId: any;
  @Input() index: number = 0;
  @Output() promotionChange = new EventEmitter<any>();

  currency: string = 'USD';
  isShippingNumberEdit: boolean = false;

  constructor(
    private promoteService: LotteryService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  editTracking() {
    let dialogRef = this.dialog.open(AddTrackingInformationDialogComponent, {
      data: {
        order: this.promote.order,
        isShippingNumberEdit: this.isShippingNumberEdit
      }
    });

    let self = this;

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isShippingNumberEdit == true) {
        this.promote.order = dialogRef.componentInstance.data.order;
      }
    });
  }

}
