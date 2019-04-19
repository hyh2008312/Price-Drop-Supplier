import { NgModule } from '@angular/core';

import { InventoryMainComponent } from './inventory-main/inventory-main.component';

import { InventoryItemComponent } from './inventory-item/inventory-item.component';
import { InventoryTitleComponent } from './inventory-title/inventory-title.component';
import { AddInventoryItemComponent } from './add-inventory-item/add-inventory-item.component';
import { AddInventoryTitleComponent } from './add-inventory-title/add-inventory-title.component';
import { InventoryTitleFixedComponent } from './inventory-title-fixed/inventory-title-fixed.component';
import { InventoryImageDialogComponent } from './inventory-image-dialog/inventory-image-dialog.component';
import { AddInventoryDialogComponent } from './add-inventory-dialog/add-inventory-dialog.component';
import { ExportRestockInventoryDialogComponent } from './export-restock-inventory-dialog/export-restock-inventory-dialog.component';
import { OutwardInventoryDialogComponent } from './outward-inventory-dialog/outward-inventory-dialog.component';
import { ToolTipsComponent } from './tool-tips/tool-tips.component';

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
    InventoryTitleComponent,
    InventoryImageDialogComponent,
    ToolTipsComponent,
    InventoryTitleFixedComponent,
    AddInventoryDialogComponent,
    AddInventoryItemComponent,
    AddInventoryTitleComponent,
    ExportRestockInventoryDialogComponent,
    OutwardInventoryDialogComponent
  ],
  entryComponents: [
    InventoryImageDialogComponent,
    ToolTipsComponent,
    AddInventoryDialogComponent,
    ExportRestockInventoryDialogComponent,
    OutwardInventoryDialogComponent
  ],
  providers: [
    InventoryService
  ]
})
export class InventoryModule { }

