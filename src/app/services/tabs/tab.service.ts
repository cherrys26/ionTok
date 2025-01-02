import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TabsService {
  private isHidden = false;

  constructor(private router: Router) {}

  hideTabs() {
    const tabBar = document.querySelector('ion-tab-bar');
    if (tabBar) {
      tabBar.style.display = 'none';
    }
    this.isHidden = true;
  }

  showTabs() {
    const tabBar = document.querySelector('ion-tab-bar');
    if (tabBar && this.isHidden) {
      tabBar.style.display = 'flex';
    }
    this.isHidden = false;
  }
}
