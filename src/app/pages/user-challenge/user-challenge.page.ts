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
  userLikes: string[] = [];
  isMuted: boolean = true;
  showMuteIcon: boolean = false;
  videoId: string = 'challenge-0-0';
  activeOuterIndex: number = 0; // Currently active outer swiper index
  activeInnerIndexMap: Map<string, string> = new Map(); // Maps outer slide index to the active inner swiper index

  @ViewChild('outerSwiper', { static: false }) outerSwiperRef!: ElementRef;
  outerSwiper: Swiper | null = null;

  @ViewChildren('innerSwiper') innerSwiperRefs!: QueryList<ElementRef>;
  innerSwipers: Swiper[] = [];

  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.selectedChallengeIndex = +params.get('index') || 0; // Get the index from route parameters
      this.userName = params.get('userName') || '';
    });
    this.loadChallenges();
  }

  loadChallenges() {
    this.challengeService.getUserChallenges(this.userName).subscribe(challenges => {
      this.challenges = challenges;
      this.cdr.detectChanges();
      requestAnimationFrame(() => {
        this.initializeSwipers(); // Re-initialize Swipers after videos are loaded
      });
      // Play the first video
      const video = document.getElementById(this.videoId) as HTMLVideoElement;
      video?.play();
    });
  }

  ionViewWillEnter() {
    const video = document.getElementById(this.videoId) as HTMLVideoElement;
    video?.play();
  }

  ionViewDidLeave() {
    const video = document.getElementById(this.videoId) as HTMLVideoElement;
    video?.pause();
  }

  ngOnDestroy() {
    const video = document.getElementById(this.videoId) as HTMLVideoElement;
    video?.pause();
    // Destroy Swipers on component destroy
    if (this.outerSwiper) this.outerSwiper.destroy(true, true);
    this.innerSwipers.forEach((swiper) => swiper.destroy(true, true));
  }

  toggleMute(videoElement: HTMLVideoElement) {
    this.isMuted = !this.isMuted;
    videoElement.muted = this.isMuted;

    this.showMuteIcon = true;
    setTimeout(() => {
      this.showMuteIcon = false;
    }, 1000);
  }

  initializeSwipers() {
    // Destroy any existing outer swiper
    if (this.outerSwiper) {
      this.outerSwiper.destroy(true, true);
    }

    // Initialize outer Swiper with dynamic initialSlide
    if (this.outerSwiperRef && this.outerSwiperRef.nativeElement) {
      this.outerSwiper = new Swiper(this.outerSwiperRef.nativeElement, {
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 10,
        initialSlide: this.selectedChallengeIndex, // Start at the selected challenge index
        on: {
          slideChange: (event) => {
            this.slideChanged(event);
          },
        },
      });
    }

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

  slideChanged(event: any) {
    // Pause the previous video
    const previousVideo = document.getElementById(this.videoId) as HTMLVideoElement;
    previousVideo?.pause();


    if(event.detail) {
      const swiper = event.detail[0];
      const activeIndex = swiper.activeIndex; // Get the active slide index
      const activeSlide = swiper.slides[activeIndex]; // Get the active slide element

      this.activeOuterIndex = activeIndex; // Update outer swiper index

      // Update videoId if a video element exists in the active slide
      if (this.activeInnerIndexMap.has(activeIndex.toString())) {
        this.videoId = this.activeInnerIndexMap.get(activeIndex.toString())!;
      } else {
        const videoElement = activeSlide.querySelector('video') as HTMLVideoElement;
        if (videoElement) {
          this.videoId = videoElement.id;
        }
      }
    }
    else {
      this.activeOuterIndex = this.selectedChallengeIndex;

      this.videoId = `challenge-${this.activeOuterIndex}-0`
    }

    // Play the new video
    const newVideo = document.getElementById(this.videoId) as HTMLVideoElement;
    newVideo?.play().catch((err) => console.log('Error playing video:', err));
    newVideo.muted = this.isMuted;
  }

  innerslideChanged(event: any) {
    const swiper = event.detail[0];
    // Update the map with the active inner index for the current outer slide
    this.activeInnerIndexMap.set(
      `challenge-${this.activeOuterIndex}`,
      `challenge-${this.activeOuterIndex}-${swiper.activeIndex}`
    );
  }
}
