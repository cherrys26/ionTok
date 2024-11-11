import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../services/data.service";
import { DiscoverService } from 'src/app/services/discover/discover.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-discover',
    templateUrl: './discover.page.html',
    styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

    searchText: string = '';
    isSearched: boolean = false;

    users: any[] = [];

    segmentLoading: boolean = true
    selectedSegment: string = 'people';

    constructor(
        private discoverService: DiscoverService,
        private router: Router,
        private navCtrl: NavController
    ) {
    }

    ngOnInit() {
    }

    ionViewWillLeave(){
        this.searchText = '';
    }

    textChange(e){
        this.isSearched = false;
        if(this.searchText)
        {
            this.discoverService.getUsers(this.searchText, 10).subscribe({
                next: (response) => {
                    this.users = response;
                    console.log(this.users);
                },
                error: (error) => {
                    this.users = [];
                    console.log(error)
                    console.log(this.users);
                }
            })
        }
        else {
            this.users = [];
        }
    }

    segmentChanged(event: any) {
        const selectedSegment = event.detail.value;
        console.log(selectedSegment)
        this.selectedSegment = selectedSegment;
    }

    search(){
        this.segmentLoading = true;
        if(this.searchText){
            this.isSearched = true;

            this.discoverService.getUsers(this.searchText, null).subscribe({
                next: (response) => {
                    this.users = response;
                    this.segmentLoading = false;
                    console.log(this.users);
                },
                error: (error) => {
                    this.users = [];
                    console.log(error)
                    console.log(this.users);
                }
            })
        }
    }

    goBack() {
        this.navCtrl.back(); // Navigate back in history
      }

    goToProfile(userName: string) {
        this.router.navigate([`/tabs/profile/${userName}`]);
    }
}