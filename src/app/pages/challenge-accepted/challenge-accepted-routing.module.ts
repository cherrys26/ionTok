import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChallengeAcceptedPage } from './challenge-accepted.page';

const routes: Routes = [
  {
    path: '',
    component: ChallengeAcceptedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChallengeAcceptedPageRoutingModule {}
