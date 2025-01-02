import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { authGuard } from '../guards/auth.guard'; // Import your guard function

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule),
        canMatch: [authGuard]
      },
      {
        path: 'discover',
        loadChildren: () => import('../pages/discover/discover.module').then(m => m.DiscoverPageModule),
        canMatch: [authGuard]
      },
      {
        path: 'add-video',
        loadChildren: () => import('../pages/add-video/add-video.module').then(m => m.AddVideoPageModule),
        canMatch: [authGuard]
      },
      {
        path: 'inbox',
        loadChildren: () => import('../pages/inbox/inbox.module').then(m => m.InboxPageModule),
        canMatch: [authGuard]
      },
      {
        path: 'profile/:userName',
        loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule),
        canMatch: [authGuard]
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
