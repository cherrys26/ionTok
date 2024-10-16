import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewChallengePageRoutingModule } from './view-challenge-routing.module';

import { ViewChallengePage } from './view-challenge.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { UserChallengeFeedComponent } from 'src/app/components/user-challenge-feed/user-challenge-feed.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewChallengePageRoutingModule
  ],
  declarations: [ViewChallengePage, HeaderComponent, FooterComponent, UserChallengeFeedComponent]
})
export class ViewChallengePageModule {}
