import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeMainComponent} from './home-main/home-main.component';
import {HomeCreateComponent} from './home-create/home-create.component';

const routes: Routes = [
  {
    path: '', component: HomeMainComponent
  }, {
    path: 'create', component: HomeCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
