import { NgModule } from '@angular/core';

import { LotteryMainComponent } from './lottery-main/lottery-main.component';
import { LotteryAwardCreateComponent } from './lottery-award-create/lottery-award-create.component';
import { LotteryAwardEditComponent } from './lottery-award-edit/lottery-award-edit.component';
import { ImageUploadAdditionalComponent } from './image-upload-additional/image-upload-additional.component';
import { ImageUploadColorComponent } from './image-upload-color/image-upload-color.component';
import { AwardTitleComponent } from './award-title/award-title.component';
import { AwardItemComponent } from './award-item/award-item.component';
import { PromoteItemComponent } from './promote-item/promote-item.component';
import { PromoteTitleComponent } from './promote-title/promote-title.component';
import { PromoteCreateComponent } from './promote-create/promote-create.component';
import { PromoteEditComponent } from './promote-edit/promote-edit.component';
import { SelectProductDialogComponent } from './select-product-dialog/select-product-dialog.component';
import { SelectProductTitleComponent } from './select-product-title/select-product-title.component';
import { SelectProductItemComponent } from './select-product-item/select-product-item.component';
import { PaginationComponent } from './pagination/pagination.component';

import { LotteryRoutingModule } from './lottery.routes.module';
import { SharedModule } from '../../shared/shared.module';

import { LotteryService } from './lottery.service';

@NgModule({
  imports: [
    SharedModule,
    LotteryRoutingModule
  ],
  exports: [],
  declarations: [
    LotteryMainComponent,
    LotteryAwardCreateComponent,
    LotteryAwardEditComponent,
    ImageUploadAdditionalComponent,
    ImageUploadColorComponent,
    AwardTitleComponent,
    AwardItemComponent,
    PromoteItemComponent,
    PromoteTitleComponent,
    PromoteCreateComponent,
    SelectProductDialogComponent,
    SelectProductTitleComponent,
    SelectProductItemComponent,
    PaginationComponent,
    PromoteEditComponent
  ],
  entryComponents: [
    SelectProductDialogComponent
  ],
  providers: [
    LotteryService
  ]
})
export class LotteryModule { }

