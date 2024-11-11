import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TabsService {
  private isHidden = false;

  constructor(private router: Router) {}

  hideTabs() {
    console.log("gide")
    const tabBar = document.querySelector('ion-tab-bar');
    console.log(tabBar)
    if (tabBar) {
      tabBar.style.display = 'none';
    }
    this.isHidden = true;
  }

  showTabs() {
    console.log("show")

    const tabBar = document.querySelector('ion-tab-bar');
    if (tabBar && this.isHidden) {
      tabBar.style.display = 'flex';
    }
    this.isHidden = false;
  }
}
