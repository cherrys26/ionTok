import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Swiper } from 'swiper';
import { Challenge } from 'src/app/models/challenge.model';
import { ChallengeService } from 'src/app/services/challenge/challenge.service';

@Component({
  selector: 'app-user-challenge',
  templateUrl: './user-challenge.page.html',
  styleUrls: ['./user-challenge.page.scss'],
})
export class UserChallengePage implements OnInit, AfterViewChecked {
    constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild('outerSwiper', { static: false }) outerSwiperRef!: ElementRef;
  outerSwiper: Swiper | null = null;

  @ViewChildren('innerSwiper') innerSwiperRefs!: QueryList<ElementRef>;
  innerSwipers: Swiper[] = [];

  isMuted: boolean = true;
  showMuteIcon: boolean = false;
  videoId: string = '0-0';
  activeOuterIndex: number = 0; // Currently active outer swiper index
  activeInnerIndexMap: Map<number, string> = new Map(); // Maps outer slide index to the active inner swiper index

  challenges: Challenge[] = [];
  selectedChallengeIndex: number;
  username: string = '';
  challengesLoaded = false;
  swiperInitialized = false;
  
  initialSlide = true;

  ngOnInit() {
    // Load data when component is initialized (before view is rendered)
    this.route.paramMap.subscribe((params) => {
      this.selectedChallengeIndex = +params.get('index') || 0;
      this.activeOuterIndex = +params.get('index') || 0;
      this.username = params.get('userName') || '';
      this.videoId = `${this.selectedChallengeIndex}-0`
      this.loadChallenges();
    });
  }

  ngAfterViewChecked() {
    // Ensure Swiper is initialized after DOM changes
    if (this.challenges.length > 0 && !this.swiperInitialized && this.outerSwiperRef) {
      this.outerSwiper = this.outerSwiperRef.nativeElement.swiper;
      this.initializeSwiper();
    }
  }

  async loadChallenges() {
    this.challengeService.getUserChallenges(this.username).subscribe({
      next: (challenges) => {
        this.challenges = challenges;
        // Trigger change detection to update the view
        this.cdr.detectChanges();
        // Play the first video
        const video = document.getElementById(this.videoId) as HTMLVideoElement;
        video?.play();
      },
      error: (error) => {
        console.error('Error loading challenges:', error);
      }
    });
  }

  initializeSwiper() {
    if (!this.outerSwiperRef) {
      console.error('Swiper container not found');
      return;
    }

    this.swiperInitialized = true;
    this.outerSwiper = new Swiper(this.outerSwiperRef.nativeElement, {
      direction: 'vertical',
      slidesPerView: 1,
      spaceBetween: 20,
      on: {
        init: () => {
          this.slideTo(this.selectedChallengeIndex);
        },
        slideChange: (event) => {
          this.slideChanged(event);
        },
      },
    });
        // Destroy existing inner Swipers
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
          on: {
            slideChange: (event) => {
              this.innerslideChanged(event);
            },
          },
        });

        this.innerSwipers.push(innerSwiper);
      }
    });

  }

  slideTo(index: number) {
    if (this.outerSwiper) {
      this.outerSwiper.slideTo(index);
      this.initialSlide = false;
    } else {
      console.error('Swiper instance is not available for sliding');
    }
  }

  toggleMute(videoElement: HTMLVideoElement) {
    this.isMuted = !this.isMuted;
    videoElement.muted = this.isMuted;

    this.showMuteIcon = true;
    setTimeout(() => {
      this.showMuteIcon = false;
    }, 1000);
  }

  slideChanged(event: any) {
    if(!this.initialSlide){
      var previousVideo = document.getElementById(this.videoId) as HTMLVideoElement;
      if (previousVideo && typeof previousVideo.pause === 'function') {
        previousVideo.pause();
      }

      if(event.detail) {
        var swiper = event.detail[0];
        var activeIndex = swiper.activeIndex; // Get the active slide index
        var activeSlide = swiper.slides[activeIndex]; // Get the active slide element

        if(swiper.isVertical())
          this.activeOuterIndex = activeIndex

        console.log(this.activeInnerIndexMap, activeIndex)

        if(this.activeInnerIndexMap.get(activeIndex)) {
          this.videoId = this.activeInnerIndexMap.get(activeIndex);
        }
        else {
          var videoElement = activeSlide.querySelector('video') as HTMLVideoElement;

          if (videoElement) {
            this.videoId = videoElement.id;
          }
        }
      }
      else {
        this.activeOuterIndex = this.selectedChallengeIndex;
  
        this.videoId = `${this.activeOuterIndex}-0`
      }

      var newVideo = document.getElementById(this.videoId) as HTMLVideoElement;

      if (newVideo && typeof newVideo.play === 'function') {
        newVideo.play().catch(err => console.log('Error playing video:', err));
        newVideo.muted = this.isMuted;
      }
    }
  }

  innerslideChanged(event) {
    var swiper = event.detail[0];
  
    // Update the map with the active inner index for the current outer slide
    this.activeInnerIndexMap.set(this.activeOuterIndex, `${this.activeOuterIndex}-${swiper.activeIndex}`);
  }
}
