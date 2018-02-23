import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountMainComponent} from "./account-main/account-main.component";
import {AccountBalanceComponent} from "./account-balance/account-balance.component";
import {AccountPaymentSettingComponent} from "./account-payment-setting/account-payment-setting.component";

const routes: Routes = [
  {
    path: 'balance',
    component: AccountBalanceComponent
  }, {
    path: 'paymentSettings',
    component: AccountPaymentSettingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
