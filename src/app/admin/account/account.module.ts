import {NgModule} from '@angular/core';

import {AccountRoutingModule} from './account.routes.module';
import {SharedModule} from '../../shared/shared.module';
import {AccountService} from "./account.service";
import {AccountItemComponent} from "./account-item/account-item.component";
import {AccountBalanceComponent} from "./account-balance/account-balance.component";
import {AccountMainComponent} from "./account-main/account-main.component";
import {AccountTitleComponent} from "./account-title/account-title.component";

@NgModule({
  imports: [
    SharedModule,
    AccountRoutingModule
  ],
  exports: [],
  declarations: [
    AccountItemComponent,
    AccountBalanceComponent,
    AccountMainComponent,
    AccountTitleComponent

  ],
  entryComponents: [],
  providers: [AccountService]
})
export class AccountModule {
}

