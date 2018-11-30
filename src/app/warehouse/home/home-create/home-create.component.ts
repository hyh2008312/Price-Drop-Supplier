import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators , FormArray } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import { MatDialog } from '@angular/material';

import { HomeService } from '../home.service';
import { UserService } from  '../../../shared/services/user/user.service';

import { ImageUploadPreviewService } from "../../../shared/components/image-upload-preview/image-upload-preview.service";
import { S3UploaderService } from "../../../shared/services/s3-upload/s3-upload.service";

@Component({
  selector: 'app-warehouse-home-create',
  templateUrl: './home-create.component.html',
  styleUrls: ['../_home.scss']
})

export class HomeCreateComponent implements OnInit {

  productForm : FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private adminService: HomeService,
    private ngZone: NgZone,
    private previewImageService: ImageUploadPreviewService,
    private s3UploaderService: S3UploaderService,
    @Inject(DOCUMENT) private document: Document,
    private userService :UserService
  ) {

    this.productForm = this.fb.group({
      title: ['', Validators.required],
      grandParentId: [null, Validators.required],
      parentId: [null],
      childId: [null],
      images: [[]],
      aliasSize: [''],
      aliasColor: [''],
      attributes: this.fb.array([]),
      specification: this.fb.array([]),
      variants: this.fb.array([]),
      shippings: this.fb.array([]),
      brandName: [''],
      description: ['Please add home details and images', Validators.required],
      length: [0, Validators.required],
      width: [0, Validators.required],
      height: [0, Validators.required],
      weight: [0, Validators.required],
      shippingWeight: [0, Validators.required],
      shopName: [''],
      supplierLocation: [''],
      processingTime: ['5-7'],
      minimumQuantity: [1],
      customsDeclaredCharge: [0, Validators.required],
      originCountryId: [null, Validators.required],
      isPowder: [false, Validators.required],
      isLiquid: [false, Validators.required],
      isBattery: [false, Validators.required],
      purchaseLink: [' ', Validators.required]
    });

  }

  ngOnInit() {

  }

  ngOnDestroy() {}

}
