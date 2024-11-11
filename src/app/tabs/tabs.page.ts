import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
    isIconChange: boolean = true;
    isNotHome: boolean = true;
    userName: string;
    selectedTab: string;
    
    @Output() homeTabClickedAgain = new EventEmitter<void>();

    constructor(private route: ActivatedRoute, private authService: AuthService) {
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            this.userName = this.authService.getUsernameFromToken();
        });
      }

    tabClicked(e) {
        const tab = e.tab;
        this.selectedTab = tab;
    }

    homeClicked(event) {
        if (this.selectedTab === 'home') {
            this.homeTabClickedAgain.emit();
        }
    }
}
