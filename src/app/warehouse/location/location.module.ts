import { NgModule } from '@angular/core';

import { LocationMainComponent } from './location-main/location-main.component';

import { LocationItemComponent } from './location-item/location-item.component';
import { LocationTitleComponent } from './location-title/location-title.component';
import { LocationTitleFixedComponent } from './location-title-fixed/location-title-fixed.component';
import { LocationImageDialogComponent } from './location-image-dialog/location-image-dialog.component';
import { AddLocationDialogComponent } from './add-location-dialog/add-location-dialog.component';
import { ToolTipsComponent } from './tool-tips/tool-tips.component';

import { LocationRoutingModule } from './location.routes.module';
import { SharedModule } from '../../shared/shared.module';

import { LocationService } from './location.service';

@NgModule({
  imports: [
    SharedModule,
    LocationRoutingModule
  ],
  exports: [],
  declarations: [
    LocationMainComponent,
    LocationItemComponent,
    LocationTitleComponent,
    LocationImageDialogComponent,
    ToolTipsComponent,
    LocationTitleFixedComponent,
    AddLocationDialogComponent
  ],
  entryComponents: [
    LocationImageDialogComponent,
    ToolTipsComponent,
    AddLocationDialogComponent
  ],
  providers: [
    LocationService
  ]
})
export class InventoryModule { }

