import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';
import { Router } from '@angular/router'; // Import Router
import { HttpClient } from '@angular/common/http';
import { LikeService } from 'src/app/services/likes/like.service';
import { CommentService } from 'src/app/services/comment/comment.service';
import { IonContent } from '@ionic/angular';

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
  @ViewChild('content', { static: false }) content: IonContent;

  isHeartFilled = false; // Property to track heart state
  isComment: boolean = false;
  comments: any[] = [];
  newComment: string = '';

  option: AnimationOptions = {
    path: './assets/animations/music.json'
  };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private httpClient: HttpClient,
    private likeService: LikeService,
    private commentService: CommentService
  ) {
  }

  ngOnInit() {
    console.log(this.video)
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

    loadComments() {
      this.comments = [];
      this.cdr.detectChanges();

      this.commentService.getComments(this.challengeType, this.video.guid).subscribe((data) => {
        this.comments = data;
        this.cdr.detectChanges();
      });
    }
    
    toggleLike(guid: string, parentType: string) {
      this.likeService.postLike(guid, parentType).subscribe(l => {
        var comment = this.comments.find(x => x.guid == guid);
  
        comment.isLiked = !comment.isLiked
        if(comment.isLiked)
          comment.likesCount++
        else
          comment.likesCount--
      })  
    }
  
    postComment(videoGuid: string){
      this.commentService.postComment(this.newComment, this.challengeType, videoGuid).subscribe((c) => {
        this.video.commentsCount++;
        this.comments.unshift(c)
        this.cdr.detectChanges();
        this.newComment = ''
        this.content.scrollToTop(500);
      })
    }
}
