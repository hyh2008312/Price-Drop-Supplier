import { NgModule } from '@angular/core';

import { HomeMainComponent } from './home-main/home-main.component';
import { HomeCreateComponent } from './home-create/home-create.component';

import { HomeItemComponent } from './home-item/home-item.component';
import { HomeTitleComponent } from './home-title/home-title.component';

import { OrderTrackingDialogComponent } from './order-tracking-dialog/order-tracking-dialog.component';
import { OrderDetailDialogComponent } from './order-detail-dialog/order-detail-dialog.component';
import { ToolTipsComponent } from './tool-tips/tool-tips.component';

import { HomeRoutingModule } from './home.routes.module';
import { SharedModule } from '../../shared/shared.module';

import { HomeService } from './home.service';

@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule
  ],
  exports: [],
  declarations: [
    HomeMainComponent,
    HomeCreateComponent,
    HomeItemComponent,
    HomeTitleComponent,
    OrderTrackingDialogComponent,
    OrderDetailDialogComponent,
    ToolTipsComponent
  ],
  entryComponents: [
    OrderTrackingDialogComponent,
    OrderDetailDialogComponent,
    ToolTipsComponent
  ],
  providers: [
    HomeService
  ]
})
export class HomeModule { }

