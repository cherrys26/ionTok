import { 
  ChangeDetectorRef, 
  Component, 
  ElementRef, 
  OnInit, 
  ViewChild, 
  OnDestroy 
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Challenge } from 'src/app/models/challenge.model';
import { ChallengeService } from 'src/app/services/challenge/challenge.service';
import { LikeService } from 'src/app/services/likes/like.service';
import { Swiper } from 'swiper';

@Component({
  selector: 'app-view-challenge',
  templateUrl: './view-challenge.page.html',
  styleUrls: ['./view-challenge.page.scss'],
})
export class ViewChallengePage implements OnInit, OnDestroy {
  challenge: Challenge = {} as Challenge;
  challengeId: number = 0;
  userLikes: string[] = [];
  @ViewChild('outerSwiper', { static: false }) outerSwiperRef!: ElementRef;
  outerSwiper!: Swiper | null;

  constructor(
    private challengeService: ChallengeService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private likeService: LikeService
  ) { }

  ngOnInit() {
    this.likeService.getLikes().subscribe(likes => {
      this.userLikes = likes;
    });
  }

  ionViewWillEnter() {
    this.route.paramMap.subscribe(params => {
      this.challengeId = +params.get("id");
      this.getChallenge();
    });
  }

  ionViewDidEnter() {
    // Initialize Swiper after the view is fully rendered
    this.initializeSwiper();
  }

  ionViewWillLeave() {
    // Cleanup to prevent memory leaks when leaving the view
    if (this.outerSwiper) {
      this.outerSwiper.destroy(true, true);
      this.outerSwiper = null;
    }
  }

  getChallenge() {
    this.challengeService.getChallenge(this.challengeId).subscribe(challenge => {
      this.challenge = challenge;
      this.cdr.detectChanges(); // Ensure view updates before Swiper initialization
    });
  }

  initializeSwiper() {
    requestAnimationFrame(() => {
      if (this.outerSwiperRef?.nativeElement) {
        this.outerSwiper = new Swiper(this.outerSwiperRef.nativeElement, {
          direction: 'horizontal',
          slidesPerView: 1,
          spaceBetween: 10,
        });
      }
    });
  }

  ngOnDestroy() {
    // Ensure Swiper is destroyed when component is destroyed
    if (this.outerSwiper) {
      this.outerSwiper.destroy(true, true);
      this.outerSwiper = null;
    }
  }
}
