import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Swiper } from 'swiper';
import { Challenge } from 'src/app/models/challenge.model';
import { ChallengeService } from 'src/app/services/challenge/challenge.service';

@Component({
  selector: 'app-user-challenge',
  templateUrl: './user-challenge.page.html',
  styleUrls: ['./user-challenge.page.scss'],
})
export class UserChallengePage implements OnInit {
  challenges: Challenge[] = [];
  selectedChallengeIndex: number = 0;
  userName: string = '';

  @ViewChild('outerSwiper', { static: false }) outerSwiperRef!: ElementRef;
  outerSwiper!: Swiper | null;

  @ViewChildren('innerSwiper') innerSwiperRefs!: QueryList<ElementRef>;
  innerSwipers: Swiper[] = [];

  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService, // Inject the service
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.selectedChallengeIndex = +params.get('index') || 0; // Get the index from route parameters
      this.userName = params.get('userName');
      this.loadChallenges(); // Load all challenges after getting the index
    });
  }

  loadChallenges() {
    // Load all challenges by the user
    this.challengeService.getUserChallenges(this.userName).subscribe(challenges => {
      this.challenges = challenges; // Store all challenges
      this.initializeSwipers(); // Initialize Swipers after challenges are loaded
      this.cdr.detectChanges();
      requestAnimationFrame(() => {
        this.initializeSwipers(); // Re-initialize Swipers after videos are loaded
      });

    });
  }

  initializeSwipers() {
    // Destroy any existing Swiper instance
    if (this.outerSwiper) {
      this.outerSwiper.destroy(true, true);
    }

    // Initialize outer Swiper with dynamic initialSlide
    if (this.outerSwiperRef && this.outerSwiperRef.nativeElement) {
      this.outerSwiper = new Swiper(this.outerSwiperRef.nativeElement, {
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 10,
      });
    }

    // Destroy any existing inner Swipers
    this.innerSwipers.forEach((swiper) => swiper.destroy(true, true));
    this.innerSwipers = [];

    // Initialize inner Swipers
    this.innerSwiperRefs.forEach((swiperRef: ElementRef) => {
      const innerSwiperElement = swiperRef.nativeElement;
      if (innerSwiperElement) {
        const innerSwiper = new Swiper(innerSwiperElement, {
          direction: 'horizontal',
          slidesPerView: 1,
          spaceBetween: 10,
        });

        this.innerSwipers.push(innerSwiper);
      }
    });
  }
}
