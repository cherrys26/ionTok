import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChallengeAcceptedPageRoutingModule } from './challenge-accepted-routing.module';

import { ChallengeAcceptedPage } from './challenge-accepted.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChallengeAcceptedPageRoutingModule
  ],
  declarations: [ChallengeAcceptedPage]
})
export class ChallengeAcceptedPageModule {}
