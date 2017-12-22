import { NgModule } from '@angular/core';

import { ProductMainComponent } from './product-main/product-main.component';
import { ProductCreateComponent } from './product-create/product-create.component';

import { ProductItemComponent } from './product-item/product-item.component';
import { ProductTitleComponent } from './product-title/product-title.component';

import { ImageUploadMainComponent } from './image-upload-main/image-upload-main.component';
import { ImageUploadAdditionalComponent } from './image-upload-additional/image-upload-additional.component';

import { SaveProductDialogComponent } from './save-product-dialog/save-product-dialog.component';

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
    ProductCreateComponent,
    ProductItemComponent,
    ProductTitleComponent,
    ImageUploadMainComponent,
    ImageUploadAdditionalComponent,
    SaveProductDialogComponent
  ],
  entryComponents: [
    SaveProductDialogComponent
  ],
  providers: []
})
export class ProductModule { }

