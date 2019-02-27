import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';

import { LandingService } from '../landing.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-admin-landing-create',
  templateUrl: './landing-create.component.html',
  styleUrls: ['../_landing.scss']
})

export class LandingCreateComponent implements OnInit {

  landingForm: FormGroup;
  image: any;

  constructor(
    private promoteService: LandingService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.landingForm = this.fb.group({
      name: ['', Validators.required],
      image: [''],
      color: [''],
      templateId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

}
