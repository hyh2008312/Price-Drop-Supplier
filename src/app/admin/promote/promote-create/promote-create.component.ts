import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { PromoteService } from '../promote.service';

import { SelectProductDialogComponent } from  '../select-product-dialog/select-product-dialog.component';

@Component({
  selector: 'app-promote-promote-create',
  templateUrl: './promote-create.component.html',
  styleUrls: ['../_promote.scss']
})

export class PromoteCreateComponent implements OnInit {

  currency: string = 'USD';

  promotionForm: FormGroup;

  campaignType = ['Flash Sale'];

  isEdit: boolean = false;

  campaign: any = {};

  categoryList: any;

  constructor(
    private promoteService: PromoteService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {

    this.promotionForm = this.fb.group({
      title: ['', Validators.required],
      type: ['Flash Sale', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.promoteService.getCategoryList().then((data) => {
      this.categoryList = data;
    });
  }

  continue() {
    if(this.promotionForm.invalid) {
      return;
    }

    let params = this.promotionForm.value;

    params.startTime = new Date(params.startTime).getTime() / 1000;
    params.endTime = new Date(params.endTime).getTime() / 1000;

    this.promoteService.promotionCreate(this.promotionForm.value).then((data) => {
      if(data) {
        this.isEdit = true;
        this.campaign = data;
      }
    });
  }

  selectProduct() {
    let dialogRef = this.dialog.open(SelectProductDialogComponent, {
      data: {
        //categoryList: this.categoryList,
        //promotionId: this.campaign.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
