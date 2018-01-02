import { NgModule } from '@angular/core';

import { OrderMainComponent } from './order-main/order-main.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';

import { OrderItemComponent } from './order-item/order-item.component';
import { OrderTitleComponent } from './order-title/order-title.component';
import { OrderDetailItemComponent } from './order-detail-item/order-detail-item.component';
import { OrderDetailTitleComponent } from './order-detail-title/order-detail-title.component';
import { OrderDetailTrackingItemComponent } from './order-detail-tracking-item/order-detail-tracking-item.component';
import { AddTrackingInformationDialogComponent } from './add-tracking-information-dialog/add-tracking-information-dialog.component';
import { CancelOrderDialogComponent } from './cancel-order-dialog/cancel-order-dialog.component';
import { CancelFulfillmentDialogComponent } from './cancel-fulfillment-dialog/cancel-fulfillment-dialog.component';

import { OrderRoutingModule } from './order.routes.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    OrderRoutingModule
  ],
  exports: [],
  declarations: [
    OrderMainComponent,
    OrderDetailComponent,
    OrderItemComponent,
    OrderTitleComponent,
    OrderDetailItemComponent,
    OrderDetailTitleComponent,
    OrderDetailTrackingItemComponent,
    AddTrackingInformationDialogComponent,
    CancelOrderDialogComponent,
    CancelFulfillmentDialogComponent
  ],
  entryComponents: [
    AddTrackingInformationDialogComponent,
    CancelOrderDialogComponent,
    CancelFulfillmentDialogComponent
  ],
  providers: []
})
export class OrderModule { }

