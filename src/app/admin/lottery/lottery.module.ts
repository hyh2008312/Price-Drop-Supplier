import { NgModule } from '@angular/core';

import { LotteryMainComponent } from './lottery-main/lottery-main.component';
import { LotteryAwardCreateComponent } from './lottery-award-create/lottery-award-create.component';
import { LotteryAwardEditComponent } from './lottery-award-edit/lottery-award-edit.component';
import { ImageUploadAdditionalComponent } from './image-upload-additional/image-upload-additional.component';
import { ImageUploadColorComponent } from './image-upload-color/image-upload-color.component';
import { AwardTitleComponent } from './award-title/award-title.component';
import { AwardItemComponent } from './award-item/award-item.component';

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
    AwardItemComponent
  ],
  entryComponents: [],
  providers: [
    LotteryService
  ]
})
export class LotteryModule { }

