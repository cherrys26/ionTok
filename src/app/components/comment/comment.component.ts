import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from 'src/app/services/comment/comment.service';
import { LikeService } from 'src/app/services/likes/like.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent  implements OnInit {
  @Input() id!: string;
  @Input() parentType!: string;

  comments: any[] = [];

  constructor(
    private commentService: CommentService,
    private likeService: LikeService
  ) {}

  ngOnInit() {
    this.loadComments(); // Fetch comments on modal load
  }

  loadComments() {
    this.commentService.getComments(this.parentType, this.id).subscribe((data) => {
      this.comments = data;
    });
  }
  
  toggleLike(guid: string, parentType: string) {
    console.log(guid);
    this.likeService.postLike(guid, parentType).subscribe(l => {
      var comment = this.comments.find(x => x.guid == guid);

      comment.isLiked = !comment.isLiked
      if(comment.isLiked)
        comment.likesCount++
      else
        comment.likesCount--
    })  
  }
}
