import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConstantService } from  '../../../shared/services/constant/constant.service';

@Component({
  selector: 'app-order-authorize-return-dialog',
  templateUrl: './authorize-return-dialog.component.html',
  styleUrls: ['../order.scss']
})

export class AuthorizeReturnDialogComponent implements OnInit {

  shippingForm : FormGroup;
  countries:any;
  states: any;

  modified: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AuthorizeReturnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private constantService: ConstantService
  ) {
    this.shippingForm = this.fb.group({
      RAN: ['', Validators.required],
      company: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      code: ['', Validators.required],
      phone: ['', Validators.required]
    });

    this.countries = this.constantService.getCountries();
    this.states = this.constantService.getCountries();
  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

}
