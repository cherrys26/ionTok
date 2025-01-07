import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserResponsePageRoutingModule } from './user-response-routing.module';

import { UserResponsePage } from './user-response.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { UserChallengeFeedComponent } from 'src/app/components/user-challenge-feed/user-challenge-feed.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserResponsePageRoutingModule
  ],
  declarations: [UserResponsePage, HeaderComponent, FooterComponent, UserChallengeFeedComponent]
})
export class UserResponsePageModule {}
