import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  @Input() video: any;
  @Input() challengeGuid: string;
  isHeartFilled = false; // Property to track heart state

  option: AnimationOptions = {
    path: './assets/animations/music.json'
  };

  constructor(private router: Router) {
  }

  ngOnInit() {

  }

  goToProfile(userName: string) {
    this.router.navigate([`/tabs/profile/${userName}`]);
  }

  toggleHeart() {
    this.isHeartFilled = !this.isHeartFilled; // Toggle the state
  }

  openChallengeResponse() {
    this.router.navigate(['/challenge-accepted'], { 
      queryParams: { challengeGuid: this.challengeGuid } 
    });
  }
}
