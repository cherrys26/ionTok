import {Component, OnInit} from '@angular/core';
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
    constructor(private route: ActivatedRoute, private authService: AuthService) {
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            this.userName = this.authService.getUsernameFromToken();
        });
      }


}
