import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { PromoteMainComponent } from './promote-main/promote-main.component';
import { LandingCreateComponent } from './landing-create/landing-create.component';
import { LandingEditComponent } from './landing-edit/landing-edit.component';

const routes: Routes = [
  {
    path: '', component: PromoteMainComponent
  },
  {
    path: 'create', component: LandingCreateComponent
  },
  {
    path: 'edit/:id', component: LandingEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule {
}
