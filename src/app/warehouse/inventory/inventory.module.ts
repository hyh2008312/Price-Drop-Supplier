import { NgModule } from '@angular/core';

import { InventoryMainComponent } from './inventory-main/inventory-main.component';

import { InventoryItemComponent } from './inventory-item/inventory-item.component';
import { InventoryTitleComponent } from './inventory-title/inventory-title.component';

import { InventoryRoutingModule } from './inventory.routes.module';
import { SharedModule } from '../../shared/shared.module';

import { InventoryService } from './inventory.service';

@NgModule({
  imports: [
    SharedModule,
    InventoryRoutingModule
  ],
  exports: [],
  declarations: [
    InventoryMainComponent,
    InventoryItemComponent,
    InventoryTitleComponent
  ],
  entryComponents: [],
  providers: [
    InventoryService
  ]
})
export class InventoryModule { }

