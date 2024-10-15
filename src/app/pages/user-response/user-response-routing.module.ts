import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserResponsePage } from './user-response.page';

const routes: Routes = [
  {
    path: '',
    component: UserResponsePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserResponsePageRoutingModule {}
