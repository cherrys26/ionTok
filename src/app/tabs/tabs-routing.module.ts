import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { authGuard } from '../guards/auth.guard'; // Import your guard function

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'discover',
        loadChildren: () => import('../pages/discover/discover.module').then(m => m.DiscoverPageModule),
      },
      {
        path: 'add-video',
        loadChildren: () => import('../pages/add-video/add-video.module').then(m => m.AddVideoPageModule),
      },
      {
        path: 'inbox',
        loadChildren: () => import('../pages/inbox/inbox.module').then(m => m.InboxPageModule),
      },
      {
        path: 'profile/:userName',
        loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule),
      },
      {
        path: 'settings-and-privacy',
        loadChildren: () => import('../pages/settings-and-privacy/settings-and-privacy.module').then(m => m.SettingsAndPrivacyPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
