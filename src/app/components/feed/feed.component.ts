import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';
import { Router } from '@angular/router'; // Import Router
import { HttpClient } from '@angular/common/http';
import { LikeService } from 'src/app/services/likes/like.service';
import { CommentComponent } from '../comment/comment.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  @Input() video: any;
  @Input() challengeGuid: string;
  @Input() userLikes: string[] = [];
  @Input() challengeType: string;

  isHeartFilled = false; // Property to track heart state

  option: AnimationOptions = {
    path: './assets/animations/music.json'
  };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private httpClient: HttpClient,
    private likeService: LikeService,
    private modalCtrl: ModalController
  ) {
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

  likeChallenge(guid: string) {
    this.likeService.postLike(guid, this.challengeType).subscribe(l => {
      this.video.isLiked = !this.video.isLiked
      if(this.video.isLiked)
        this.video.likesCount++
      else
        this.video.likesCount--
    })  
  }

    // Function to open the Comments modal and pass the challenge ID
    async openComments(challengeId: string) {
      const modal = await this.modalCtrl.create({
        component: CommentComponent,
        componentProps: { id: challengeId, parentType: this.challengeType },
        initialBreakpoint: 0.6, // Set the initial size
        breakpoints: [0, 0.6, .9], // Allow sliding between breakpoints
      });
      await modal.present();
    }
}
