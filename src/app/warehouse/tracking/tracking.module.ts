import { NgModule } from '@angular/core';

import { TrackingMainComponent } from './tracking-main/tracking-main.component';
import { TrackingCreateDialogComponent } from './tracking-create-dialog/tracking-create-dialog.component';

import { TrackingItemComponent } from './tracking-item/tracking-item.component';
import { TrackingTitleComponent } from './tracking-title/tracking-title.component';

import { TrackingEditDialogComponent } from './tracking-edit-dialog/tracking-edit-dialog.component';
import { TrackingImageDialogComponent } from './tracking-image-dialog/tracking-image-dialog.component';
import { ToolTipsComponent } from './tool-tips/tool-tips.component';

import { TrackingRoutingModule } from './tracking.routes.module';
import { SharedModule } from '../../shared/shared.module';

import { TrackingService } from './tracking.service';

@NgModule({
  imports: [
    SharedModule,
    TrackingRoutingModule
  ],
  exports: [],
  declarations: [
    TrackingMainComponent,
    TrackingCreateDialogComponent,
    TrackingItemComponent,
    TrackingTitleComponent,
    TrackingEditDialogComponent,
    TrackingImageDialogComponent,
    ToolTipsComponent
  ],
  entryComponents: [
    TrackingCreateDialogComponent,
    TrackingEditDialogComponent,
    TrackingImageDialogComponent,
    ToolTipsComponent
  ],
  providers: [
    TrackingService
  ]
})
export class TrackingModule { }

