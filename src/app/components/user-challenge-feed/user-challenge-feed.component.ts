import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-challenge-feed',
  templateUrl: './user-challenge-feed.component.html',
  styleUrls: ['./user-challenge-feed.component.scss'],
})
export class UserChallengeFeedComponent  implements OnInit {
  @Input() video: any;
  @Input() challengeGuid: string;
  isHeartFilled = false; // Property to track heart state

  constructor(private router: Router) {
  }
  ngOnInit() {}

  goToProfile(userName: string) {
    this.router.navigate([`/tabs/profile/${userName}`]);
  }

  toggleHeart() {
    this.isHeartFilled = !this.isHeartFilled; // Toggle the state
  }
}
