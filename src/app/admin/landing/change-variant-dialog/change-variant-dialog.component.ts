import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { LandingService } from '../landing.service';

@Component({
  selector: 'app-promote-change-variant-dialog',
  templateUrl: './change-variant-dialog.component.html',
  styleUrls: ['../_landing.scss']
})

export class ChangeVariantDialogComponent implements OnInit {

  currency: string = 'USD';

  constructor(
    public dialogRef: MatDialogRef<ChangeVariantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private promoteService: LandingService
  ) {
  }

  ngOnInit(): void {

  }

  close() {
    this.dialogRef.close();
  }

  variantChange($event) {
    switch($event.event) {
      case 'edit':
        this.data.isEdit = true;
        break;
      case 'delete':
        this.data.variantPromotions.splice($event.index,1);
        this.data.isEdit = true;
        break;
    }
  }


}
