import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { CommentService } from 'src/app/services/comment/comment.service';
import { LikeService } from 'src/app/services/likes/like.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent  implements OnInit {
  @Input() video: any;
  @Input() challengeGuid: string;
  @Input() userLikes: string[] = [];
  @Input() challengeType: string;
  @Input() guid: string;
  @ViewChild('content', { static: false }) content: IonContent;

  isHeartFilled = false;
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
    this.loadComments() 
   }

  toggleHeart() {
    this.isHeartFilled = !this.isHeartFilled; // Toggle the state
  }

    loadComments() {
      this.comments = [];
      this.cdr.detectChanges();

      this.commentService.getComments(this.challengeType, this.video.guid).subscribe((data) => {
        this.comments = data;
        console.log(data)
        console.log(this.comments.length)
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
