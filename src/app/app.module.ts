import { NgModule } from '@angular/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule,JsonpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';


import { AppRoutingModule } from './app.routes.module';

import { AppComponent } from './app.component';

import { BaseApi, SystemConstant, DataApi } from './config/app.api';
import { BlogCover} from './config/app.constant';

import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AuthenticationModule } from './shared/services/authentication/index';
import { UserModule } from './shared/services/user/user.module';
import { GuardLinkService } from './shared/services/guard-link/guard-link.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/il8n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    JsonpModule,
    BrowserAnimationsModule,
    AuthenticationModule,
    UserModule,
    Angulartics2Module.forRoot([ Angulartics2GoogleTagManager ]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [BaseApi, SystemConstant, DataApi, BlogCover, HttpClientModule, GuardLinkService],
  bootstrap: [AppComponent]
})
export class AppModule { }
