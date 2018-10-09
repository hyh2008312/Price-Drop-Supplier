import {NgModule} from '@angular/core';

import {KeywordsRoutingModule} from './keywords.routes.module';
import {SharedModule} from '../../shared/shared.module';
import {KeywordsService} from "./keywords.service";
import {KeywordsItemComponent} from "./keywords-item/keywords-item.component";
import {KeywordsMainComponent} from "./keywords-main/keywords-main.component";

@NgModule({
  imports: [
    SharedModule,
    KeywordsRoutingModule
  ],
  exports: [],
  declarations: [
    KeywordsItemComponent,
    KeywordsMainComponent
  ],
  entryComponents: [],
  providers: [KeywordsService]
})
export class KeywordsModule {
}

