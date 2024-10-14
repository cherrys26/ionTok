import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddVideoPageRoutingModule } from './add-video-routing.module';

import { AddVideoPage } from './add-video.page';
import { HeaderComponent } from '../../components/header/header.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddVideoPageRoutingModule
  ],
  declarations: [AddVideoPage, HeaderComponent]
})
export class AddVideoPageModule {}
