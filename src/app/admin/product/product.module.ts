import { NgModule } from '@angular/core';

import { ProductMainComponent } from './product-main/product-main.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductEditComponent } from './product-edit/product-edit.component';

import { ProductItemComponent } from './product-item/product-item.component';
import { ProductTitleComponent } from './product-title/product-title.component';

import { ImageUploadMainComponent } from './image-upload-main/image-upload-main.component';
import { ImageUploadAdditionalComponent } from './image-upload-additional/image-upload-additional.component';
import { ImageUploadColorComponent } from './image-upload-color/image-upload-color.component';
import { ImageUploadVariantComponent } from './image-upload-variant/image-upload-variant.component';
import { ImageUploadVariantPreviewComponent } from './image-upload-variant-preview/image-upload-variant-preview.component';

import { SaveProductDialogComponent } from './save-product-dialog/save-product-dialog.component';
import { PendingProductDialogComponent } from './pending-product-dialog/pending-product-dialog.component';
import { DeleteVariantDialogComponent } from './delete-variant-dialog/delete-variant-dialog.component';

import { ProductRoutingModule } from './product.routes.module';
import { SharedModule } from '../../shared/shared.module';

import { ProductService } from './product.service';

@NgModule({
  imports: [
    SharedModule,
    ProductRoutingModule
  ],
  exports: [],
  declarations: [
    ProductMainComponent,
    ProductCreateComponent,
    ProductEditComponent,
    ProductItemComponent,
    ProductTitleComponent,
    ImageUploadMainComponent,
    ImageUploadAdditionalComponent,
    SaveProductDialogComponent,
    PendingProductDialogComponent,
    DeleteVariantDialogComponent,
    ImageUploadColorComponent,
    ImageUploadVariantComponent,
    ImageUploadVariantPreviewComponent
  ],
  entryComponents: [
    SaveProductDialogComponent,
    PendingProductDialogComponent,
    DeleteVariantDialogComponent
  ],
  providers: [
    ProductService
  ]
})
export class ProductModule { }

