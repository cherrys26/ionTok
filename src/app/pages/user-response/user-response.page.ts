import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Response } from 'src/app/models/response.model';
import { ChallengeService } from 'src/app/services/challenge/challenge.service';
import { Swiper } from 'swiper';

@Component({
  selector: 'app-user-response',
  templateUrl: './user-response.page.html',
  styleUrls: ['./user-response.page.scss'],
})

export class UserResponsePage implements OnInit {
  constructor(
    private challengeService: ChallengeService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private navCtrl: NavController,
    private router: Router
  ) { }
  
  @ViewChild('outerSwiper', { static: false }) outerSwiperRef!: ElementRef;
  outerSwiper: Swiper | null = null;

  activeChallengeId: number = 0;
  challengeResponses: Response[] = [];
  userName: string = '';
  activeIndex: number = 0;

  isMuted: boolean = true;
  showMuteIcon: boolean = false;
  videoId: string = '0';

  challengesLoaded = false;
  swiperInitialized = false;
  
  initialSlide = true;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.activeIndex = +params.get('index') || 0; // Get the index from route parameters
      this.userName = params.get('userName') || '';

      this.loadChallengeResponse();
    });
  }

  ngAfterViewChecked() {
    // Ensure Swiper is initialized after DOM changes
    if (this.challengeResponses.length > 0 && !this.swiperInitialized && this.outerSwiperRef) {
      this.outerSwiper = this.outerSwiperRef.nativeElement.swiper;
      this.initializeSwiper();
    }
  }
  
  async loadChallengeResponse() {
    if(this.initialSlide) {
      this.challengeService.getUserChallengeResponses(this.userName).subscribe({
        next: (challengeResponses) => {
          this.challengeResponses = challengeResponses;
          this.videoId = `${this.activeIndex}`;

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
    else{
      const video = document.getElementById(this.videoId) as HTMLVideoElement;
      video?.play();
    }
  }

  ionViewDidLeave() {
    // Pause the video when leaving the page
    var video = document.getElementById(this.videoId) as HTMLVideoElement;
    if (video) {
      video.pause();
    }
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
          this.slideTo(this.activeIndex);
        },
        slideChange: (event) => {
          this.slideChanged(event);
        },
      },
    });
  }

  slideTo(index: number) {
    if (this.outerSwiper) {
      this.outerSwiper.slideTo(index);
      var challenge = this.challengeResponses[index]
      if(challenge != null)
        this.activeChallengeId = challenge.challengeId
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

        this.activeIndex = activeIndex;

        var videoElement = activeSlide.querySelector('video') as HTMLVideoElement;

        if (videoElement) {
          this.videoId = videoElement.id;
        }
      }

      var newVideo = document.getElementById(this.videoId) as HTMLVideoElement;

      if (newVideo && typeof newVideo.play === 'function') {
        newVideo.play().catch(err => console.log('Error playing video:', err));
        newVideo.muted = this.isMuted;
      }
    }
    var challenge = this.challengeResponses[this.activeIndex]
    if(challenge != null)
      this.activeChallengeId = challenge.challengeId
  }

  goBack() {
    this.navCtrl.back(); // Navigate back in history
  }

  GoToChallenge(){
    this.router.navigate([`/view-challenge/${this.activeChallengeId}`])
  }
}

