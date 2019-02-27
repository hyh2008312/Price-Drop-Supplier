import { NgModule } from '@angular/core';

import { HotProductMainComponent } from './hot-product-main/hot-product-main.component';
import { HotProductTitleComponent } from './hot-product-title/hot-product-title.component';
import { HotProductItemComponent } from  './hot-product-item/hot-product-item.component';
import { PromoteProductTitleComponent } from './promote-product-title/promote-product-title.component';
import { PromoteProductItemComponent } from './promote-product-item/promote-product-item.component';
import { SelectProductDialogComponent } from  './select-product-dialog/select-product-dialog.component';
import { SelectProductTitleComponent } from  './select-product-title/select-product-title.component';
import { SelectProductItemComponent } from  './select-product-item/select-product-item.component';
import { PaginationComponent } from  './pagination/pagination.component';

import { HotProductRoutingModule } from './hot-product.routes.module';
import { SharedModule } from '../../shared/shared.module';

import { HotProductService } from './hot-product.service';

@NgModule({
  imports: [
    SharedModule,
    HotProductRoutingModule
  ],
  exports: [],
  declarations: [
    HotProductMainComponent,
    HotProductTitleComponent,
    HotProductItemComponent,
    SelectProductDialogComponent,
    SelectProductTitleComponent,
    SelectProductItemComponent,
    PaginationComponent,
    PromoteProductTitleComponent,
    PromoteProductItemComponent
  ],
  entryComponents: [
    SelectProductDialogComponent
  ],
  providers: [
    HotProductService
  ]
})
export class HotProductModule { }

