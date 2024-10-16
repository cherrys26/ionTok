import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserChallengePageRoutingModule } from './user-challenge-routing.module';

import { UserChallengePage } from './user-challenge.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { UserChallengeFeedComponent } from 'src/app/components/user-challenge-feed/user-challenge-feed.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserChallengePageRoutingModule
  ],
  declarations: [UserChallengePage, HeaderComponent, FooterComponent, UserChallengeFeedComponent]
})
export class UserChallengePageModule {}