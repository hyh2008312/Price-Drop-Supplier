import { NgModule } from '@angular/core';

import { ProductRankMainComponent } from './product-rank-main/product-rank-main.component';
import { ProductRankTitleComponent } from './product-rank-title/product-rank-title.component';
import { ProductRankItemComponent } from './product-rank-item/product-rank-item.component';

import { ProductRankRoutingModule } from './product-rank.routes.module';
import { SharedModule } from '../../shared/shared.module';

import { ProductRankService } from './product-rank.service';

@NgModule({
  imports: [
    SharedModule,
    ProductRankRoutingModule
  ],
  exports: [],
  declarations: [
    ProductRankMainComponent,
    ProductRankTitleComponent,
    ProductRankItemComponent
  ],
  entryComponents: [],
  providers: [
    ProductRankService
  ]
})
export class ProductRankModule { }

