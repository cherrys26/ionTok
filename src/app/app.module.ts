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

import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { TokenInterceptor } from './interceptors/token.interceptor'; // Path to your interceptor
import { JwtModule } from '@auth0/angular-jwt';

export function playerFactory() {
  return player;
}
export function tokenGetter() {
  return localStorage.getItem('jwtToken');
}

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['yourapi.com'], // Replace with your API domain
        disallowedRoutes: [],
      },
    }),],
    providers: [MediaCapture, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
      provideLottieOptions({
        player: () => import('lottie-web'),
      }),
      // { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
