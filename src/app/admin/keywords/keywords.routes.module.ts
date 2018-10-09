import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {KeywordsMainComponent} from "./keywords-main/keywords-main.component";

const routes: Routes = [
  {
    path: '', component: KeywordsMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KeywordsRoutingModule {
}
