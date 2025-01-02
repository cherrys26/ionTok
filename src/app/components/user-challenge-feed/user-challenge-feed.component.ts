import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { CommentService } from 'src/app/services/comment/comment.service';
import { LikeService } from 'src/app/services/likes/like.service';

@Component({
  selector: 'app-user-challenge-feed',
  templateUrl: './user-challenge-feed.component.html',
  styleUrls: ['./user-challenge-feed.component.scss'],
})
export class UserChallengeFeedComponent  implements OnInit {
  @Input() video: any;
  @Input() challengeType: string;
  @ViewChild('content', { static: false }) content: IonContent;
  
  isHeartFilled = false; // Property to track heart state
  isComment: boolean = false;
  comments: any[] = [];
  newComment: string = '';

  constructor(
      private router: Router,
      private cdr: ChangeDetectorRef,
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
