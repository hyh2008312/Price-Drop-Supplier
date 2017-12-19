import { NgModule } from '@angular/core';

import { ProductMainComponent } from './product-main/product-main.component';

import { ProductItemComponent } from './product-item/product-item.component';
import { ProductTitleComponent } from './product-title/product-title.component';

import { ProductRoutingModule } from './product.routes.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ProductRoutingModule
  ],
  exports: [],
  declarations: [
    ProductMainComponent,
    ProductItemComponent,
    ProductTitleComponent
  ],
  entryComponents: [

  ],
  providers: []
})
export class ProductModule { }

