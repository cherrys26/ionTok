import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import {FeedComponent} from "../../components/feed/feed.component";
import { LottieComponent } from 'ngx-lottie';
import {FooterComponent} from "../../components/footer/footer.component";
import { CommentComponent } from 'src/app/components/comment/comment.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        LottieComponent
    ],
  declarations: [HomePage, FeedComponent, FooterComponent, CommentComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
