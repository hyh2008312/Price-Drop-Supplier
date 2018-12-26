import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';

import { SizeChartService } from '../sizeChart.service';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material';

import { saveAs } from 'file-saver';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ENTER } from '@angular/cdk/keycodes';

import { AddTabDialogComponent } from  '../add-tab-dialog/add-tab-dialog.component';
import { MatSnackBar } from '@angular/material';
import {ToolTipsComponent} from '../tool-tips/tool-tips.component';

@Component({
  selector: 'app-sizeChart-edit',
  templateUrl: './sizeChart-edit.component.html',
  styleUrls: ['../_sizeChart.scss']
})

export class SizeChartEditComponent implements OnInit {


  sizeChartForm: FormGroup;
  error: any = false;

  sizeChart: any = [];

  selectable:boolean = true;
  removable:boolean = true;
  addOnBlur:boolean = true;

  selectedIndex: any = 0;

  separatorKeysCodes = [ENTER, 188];

  constructor(
    private sizeChartService: SizeChartService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {

    this.sizeChartForm = this.fb.group({
      chartId: [''],
      name: ['', Validators.required],
      note: ['']
    });

    this.getDetail();
  }

  ngOnInit(): void {}

  ngOnDestroy() {}

  getDetail() {
    this.sizeChartService.getSizeChart({
      chart_id: this.activatedRoute.snapshot.params['id']
    }).then((data) => {
      this.sizeChartForm.patchValue({
        chartId: data.id,
        name: data.name,
        note: data.sizeChart.note
      });
      this.sizeChart = data.sizeChart
    });
  }

  save() {
    if(this.sizeChartForm.invalid) {
      return;
    }

    let params: any = this.sizeChartForm.value;
    params.sizeChart = this.sizeChart;
    params.sizeChart.note = this.sizeChartForm.value.note;

    this.sizeChartService.editSizeChart(params).then((data) => {
      this.openSnackBar();
    });
  }

  addTabName() {
    let dialogRef = this.dialog.open(AddTabDialogComponent, {
      data: {
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isEdit == true) {
        this.sizeChart.push({
          name: dialogRef.componentInstance.data.name,
          children: []
        });
        this.selectedIndex = this.sizeChart.length - 1;
      }
    });

  }

  deleteName($event) {
    this.sizeChart.splice(this.selectedIndex, 1);
    this.selectedIndex = 0;
  }

  getSubTabList($event) {

  }

  addColoumn() {
    this.sizeChart[this.selectedIndex].children.push({
      name: '',
      value: []
    });
  }

  deleteColumn(i) {
    this.sizeChart[this.selectedIndex].children.splice(i, 1);
  }

  remove(index, item) {
    item.value.splice(index, 1);
  }

  add($event: any, p) {
    let input = $event.input;
    let value = $event.value;

    // Add our fruit
    if ((value || '').trim()) {
      p.value.push({
        value: $event.value
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

  }

  openSnackBar() {
    this.snackBar.openFromComponent(ToolTipsComponent, {
      data: 'Successfully Saved!',
      duration: 4000,
      verticalPosition: 'top'
    });
  }
}
