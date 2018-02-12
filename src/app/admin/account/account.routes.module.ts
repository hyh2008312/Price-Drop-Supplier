import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountMainComponent} from "./account-main/account-main.component";
import {AccountBalanceComponent} from "./account-balance/account-balance.component";

const routes: Routes = [
  {
    path: 'balance', component: AccountBalanceComponent

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
