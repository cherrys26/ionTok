import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserChallengePage } from './user-challenge.page';

const routes: Routes = [
  {
    path: '',
    component: UserChallengePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserChallengePageRoutingModule {}
