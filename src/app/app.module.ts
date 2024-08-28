import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import player from 'lottie-web';
import { provideLottieOptions } from 'ngx-lottie';
import { MediaCapture } from '@ionic-native/media-capture/ngx';

export function playerFactory() {
  return player;
}

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
    providers: [MediaCapture, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
      provideLottieOptions({
        player: () => import('lottie-web'),
      })
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
