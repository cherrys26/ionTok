import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'confirm-email',
    loadChildren: () => import('./pages/confirm-email/confirm-email.module').then( m => m.ConfirmEmailPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canMatch: [authGuard]  // Apply the guard function
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canMatch: [authGuard]  // Apply the guard function
  },
  {
    path: 'discover',
    loadChildren: () => import('./pages/discover/discover.module').then(m => m.DiscoverPageModule),
    canMatch: [authGuard]  // Apply the guard function
  },
  {
    path: 'add-video',
    loadChildren: () => import('./pages/add-video/add-video.module').then(m => m.AddVideoPageModule),
    canMatch: [authGuard]  // Apply the guard function
  },
  {
    path: 'inbox',
    loadChildren: () => import('./pages/inbox/inbox.module').then(m => m.InboxPageModule),
    canMatch: [authGuard]  // Apply the guard function
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    canMatch: [authGuard]  // Apply the guard function
  },
  {
    path: 'settings-and-privacy',
    loadChildren: () => import('./pages/settings-and-privacy/settings-and-privacy.module').then(m => m.SettingsAndPrivacyPageModule),
    canMatch: [authGuard]  // Apply the guard function
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
