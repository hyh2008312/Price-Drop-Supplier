import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';

import { LandingService } from '../landing.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-admin-landing-edit',
  templateUrl: './landing-edit.component.html',
  styleUrls: ['../_landing.scss']
})

export class LandingEditComponent implements OnInit {

  landingForm: FormGroup;
  src: any;
  bgSrc: any;

  categoryList: any;
  subCategoryList: any;
  thirdCategoryList: any;
  categoryId: any;

  constructor(
    private promoteService: LandingService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    this.landingForm = this.fb.group({
      id: [],
      width: ['', Validators.required],
      color: ['', Validators.required],
      sort: [1, Validators.required],
      grantParentId: [''],
      parentId: [''],
      childId: [''],
      categoryId: ['',  Validators.required],
      isShow: [false,  Validators.required]
    });


    this.getCategoryDetail();

  }

  getCategoryList() {
    this.promoteService.getCategoryList().then((data) => {
      this.categoryList = [...data];
      for(let item of this.categoryList) {
        if(item.id == this.categoryId) {
          this.landingForm.patchValue({
            grantParentId: item.id
          });
        } else {
          if(item.children && item.children.length > 0) {
            for(let em of item.children) {
              if(em.id == this.categoryId) {
                this.subCategoryList = item.children;
                this.landingForm.patchValue({
                  parentId: em.id
                });
              } else {
                if(em.children && em.children.length > 0) {
                  for(let fm of em.children) {
                    if(fm.id == this.categoryId) {
                      this.thirdCategoryList = em.children;
                      this.landingForm.patchValue({
                        children: fm.id
                      });
                    }
                  }
                }
              }
            }
          }

        }
      }
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

  getCategoryDetail() {
    let id = this.activatedRoute.snapshot.params['id'];

    this.promoteService.getCategoryDetail({
      id
    }).then((res) => {
      this.landingForm.patchValue({
        id: res.id,
        width: res.width,
        color: res.color,
        sort: res.sort,
        categoryId: res.categoryId,
        isShow: res.isShow
      });
      this.categoryId = res.categoryId;
      this.src = res.src;
      this.bgSrc = res.bgSrc;

      this.getCategoryList();
    })
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
    this.promoteService.editCategory(params).then(() => {
      this.router.navigate(['../../'], { replaceUrl: true, relativeTo: this.activatedRoute});
    });
  }

}
