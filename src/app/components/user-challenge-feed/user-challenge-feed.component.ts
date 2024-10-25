import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LikeService } from 'src/app/services/likes/like.service';

@Component({
  selector: 'app-user-challenge-feed',
  templateUrl: './user-challenge-feed.component.html',
  styleUrls: ['./user-challenge-feed.component.scss'],
})
export class UserChallengeFeedComponent  implements OnInit {
  @Input() video: any;
  @Input() challengeGuid: string;
  @Input() userLikes: string[] = [];
  @Input() challengeType: string;

  isHeartFilled = false; // Property to track heart state

  constructor(private router: Router, private likeService: LikeService) {
  }
  ngOnInit() {    
    console.log(this.userLikes)
    console.log(this.video.guid)
    if(this.userLikes.includes(this.video.guid))
      this.toggleHeart();
  }

  goToProfile(userName: string) {
    this.router.navigate([`/tabs/profile/${userName}`]);
  }

  toggleHeart() {
    this.isHeartFilled = !this.isHeartFilled; // Toggle the state
  }

  likeChallenge(guid: string) {
    this.likeService.postLike(guid, this.challengeType).subscribe(l => {
      this.isHeartFilled = !this.isHeartFilled; // Toggle the state
      if(this.isHeartFilled)
        this.video.likesCount++
      else
        this.video.likesCount--
    })  
  }
}
