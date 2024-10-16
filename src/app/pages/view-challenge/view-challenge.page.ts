import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Challenge } from 'src/app/models/challenge.model';
import { ChallengeService } from 'src/app/services/challenge/challenge.service';
import { Swiper } from 'swiper';

@Component({
  selector: 'app-view-challenge',
  templateUrl: './view-challenge.page.html',
  styleUrls: ['./view-challenge.page.scss'],
})
export class ViewChallengePage implements OnInit {
  challenge: Challenge = {} as Challenge;
  challengeId: number = 0;

  @ViewChild('outerSwiper', { static: false }) outerSwiperRef!: ElementRef;
  outerSwiper!: Swiper | null;

  constructor(
    private challengeService: ChallengeService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.challengeId = +params.get("id");
      this.getChallenge();
      this.cdr.detectChanges();
      requestAnimationFrame(() => {
        this.initializeSwiper();
      });
    });
  }


  ionViewWillEnter() {
    this.cdr.detectChanges();
    requestAnimationFrame(() => {
      this.initializeSwiper();
    });
  }

  getChallenge(){
    this.challengeService.getChallenge(this.challengeId).subscribe(challenge => {
      this.challenge = challenge; 
      console.log(this.challenge)
    });
  }

  initializeSwiper() {
    // Destroy any existing Swiper instance
    if (this.outerSwiper) {
      this.outerSwiper.destroy(true, true);
    }

    // Initialize outer Swiper with dynamic initialSlide
    if (this.outerSwiperRef && this.outerSwiperRef.nativeElement) {
      this.outerSwiper = new Swiper(this.outerSwiperRef.nativeElement, {
        direction: 'horizontal',
        slidesPerView: 1,
        spaceBetween: 10,
      });
    }
  }
}
