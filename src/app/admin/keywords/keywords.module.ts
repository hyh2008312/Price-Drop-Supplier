import {NgModule} from '@angular/core';

import {KeywordsRoutingModule} from './keywords.routes.module';
import {SharedModule} from '../../shared/shared.module';
import {KeywordsService} from "./keywords.service";
import {KeywordsItemComponent} from "./keywords-item/keywords-item.component";
import {KeywordsTitleComponent} from "./keywords-title/keywords-title.component";
import {KeywordsMainComponent} from "./keywords-main/keywords-main.component";
import {KeywordsDetailTitleComponent} from "./keywords-detail-title/keywords-detail-title.component";
import {KeywordsDetailItemComponent} from "./keywords-detail-item/keywords-detail-item.component";
import {KeywordsDetailComponent} from "./keywords-detail/keywords-detail.component";

@NgModule({
  imports: [
    SharedModule,
    KeywordsRoutingModule
  ],
  exports: [],
  declarations: [
    KeywordsItemComponent,
    KeywordsMainComponent,
    KeywordsDetailComponent,
    KeywordsTitleComponent,
    KeywordsDetailTitleComponent,
    KeywordsDetailItemComponent
  ],
  entryComponents: [],
  providers: [KeywordsService]
})
export class KeywordsModule {
}

