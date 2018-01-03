import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-issue-refund-dialog',
  templateUrl: './issue-refund-dialog.component.html',
  styleUrls: ['../order.scss']
})

export class IssueRefundDialogComponent implements OnInit {

  shippingForm : FormGroup;
  modified: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<IssueRefundDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.shippingForm = this.fb.group({
      carrier: ['', Validators.required],
      number: ['', Validators.required],
      URL: ['', Validators.required]
    });
  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

}
