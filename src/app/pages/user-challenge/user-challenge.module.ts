import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserChallengePageRoutingModule } from './user-challenge-routing.module';

import { UserChallengePage } from './user-challenge.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserChallengePageRoutingModule
  ],
  declarations: [UserChallengePage]
})
export class UserChallengePageModule {}
