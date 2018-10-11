import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { AddressService } from '../address.service';

@Component({
  selector: 'app-address-address-edit',
  templateUrl: './address-edit.component.html',
  styleUrls: ['../_address.scss']
})

export class AddressEditComponent implements OnInit {

  currency: string = 'USD';

  addressForm: FormGroup;

  constructor(
    private addressService: AddressService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {

    this.addressForm = this.fb.group({
      title: ['', Validators.required],
      promotionType: ['Flash Sale', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.addressService.getCategoryList().then((data) => {});
  }

}
