import { NgModule } from '@angular/core';

import { PromoteMainComponent } from './promote-main/promote-main.component';

import { PromoteItemComponent } from './promote-item/promote-item.component';
import { PromoteTitleComponent } from './promote-title/promote-title.component';


import { PromoteRoutingModule } from './promote.routes.module';
import { SharedModule } from '../../shared/shared.module';

import { PromoteService } from './promote.service';

@NgModule({
  imports: [
    SharedModule,
    PromoteRoutingModule
  ],
  exports: [],
  declarations: [
    PromoteMainComponent,
    PromoteItemComponent,
    PromoteTitleComponent
  ],
  entryComponents: [
  ],
  providers: [
    PromoteService
  ]
})
export class PromoteModule { }

