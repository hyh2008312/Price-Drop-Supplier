import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';

import { LandingService } from '../landing.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-admin-landing-create',
  templateUrl: './landing-create.component.html',
  styleUrls: ['../_landing.scss']
})

export class LandingCreateComponent implements OnInit {

  landingForm: FormGroup;
  src: any;
  bgSrc: any;

  categoryList: any;
  subCategoryList: any;
  thirdCategoryList: any;

  constructor(
    private promoteService: LandingService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    this.getCategoryList();

    this.landingForm = this.fb.group({
      width: ['', Validators.required],
      color: ['', Validators.required],
      sort: [1, Validators.required],
      categoryId: ['',  Validators.required],
      isShow: [false,  Validators.required]
    });
  }

  getCategoryList() {
    this.promoteService.getCategoryList().then((data) => {
      this.categoryList = [...data];
    });
  }

  categoryChange($event) {
    if(this.categoryList.length > 0) {
      let index = this.categoryList.findIndex((data) => {
        if(data.id == $event) {
          return true;
        }
      });
      if(this.categoryList[index] && this.categoryList[index].children) {
        this.subCategoryList = [...this.categoryList[index].children];
        this.thirdCategoryList = [];
      } else {
        this.subCategoryList = false;
        this.thirdCategoryList = false;

      }
      this.landingForm.patchValue({
        categoryId: $event
      });
    }
  }

  subCategoryChange($event) {
    if(this.subCategoryList.length > 0) {
      let index = this.subCategoryList.findIndex((data) => {
        if(data.id == $event) {
          return true;
        }
      });
      if(this.subCategoryList[index] && this.subCategoryList[index].children) {
        this.thirdCategoryList = [...this.subCategoryList[index].children];
      } else {
        this.thirdCategoryList = false;
      }
      this.landingForm.patchValue({
        categoryId: $event
      });
    }
  }

  thirdCategoryChange($event) {
    this.landingForm.patchValue({
      categoryId: $event
    });
  }

  ngOnInit(): void {
  }

  save() {
    if(this.landingForm.invalid) {
      return;
    }

    let params: any = this.landingForm.value;
    params.src = this.src;
    params.bgSrc = this.bgSrc;
    this.promoteService.createCategory(params).then(() => {
      this.router.navigate(['../'], { replaceUrl: true, relativeTo: this.activatedRoute});
    });
  }

}
