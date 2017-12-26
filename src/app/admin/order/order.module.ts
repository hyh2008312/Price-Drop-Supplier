import { NgModule } from '@angular/core';

import { OrderMainComponent } from './order-main/order-main.component';

import { OrderItemComponent } from './order-item/order-item.component';
import { OrderTitleComponent } from './order-title/order-title.component';

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
    OrderItemComponent,
    OrderTitleComponent
  ],
  entryComponents: [

  ],
  providers: []
})
export class OrderModule { }

