import { 
  ChangeDetectorRef, 
  Component, 
  ElementRef, 
  OnInit, 
  ViewChild, 
} from '@angular/core';
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
    
    isMuted: boolean = true;
    showMuteIcon: boolean = false;
    videoId: string = 'challenge-0';
      
  @ViewChild('outerSwiper', { static: false }) outerSwiperRef!: ElementRef;
  outerSwiper!: Swiper | null;

  constructor(
    private challengeService: ChallengeService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.challengeId = +params.get("id");
      this.getChallenge();
    });  
  }

  getChallenge() {
    this.challengeService.getChallenge(this.challengeId).subscribe(challenge => {
      this.challenge = challenge;
      console.log(challenge)
      this.cdr.detectChanges(); // Ensure view updates before Swiper initialization
      this.initializeSwiper();

      const video = document.getElementById(this.videoId) as HTMLVideoElement;
      video?.play();
    });
  }

  initializeSwiper() {
    requestAnimationFrame(() => {
      if (this.outerSwiperRef?.nativeElement) {
        this.outerSwiper = new Swiper(this.outerSwiperRef.nativeElement, {
          direction: 'horizontal',
          slidesPerView: 1,
          spaceBetween: 10,
          on: {
            slideChange: (event) => {
              this.slideChanged(event);
            },
          },
        });
      }
    });
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
      var previousVideo = document.getElementById(this.videoId) as HTMLVideoElement;

      if (previousVideo && typeof previousVideo.pause === 'function') {
        previousVideo.pause();
      }

      if(event.detail) {
        var swiper = event.detail[0];
        var activeIndex = swiper.activeIndex; // Get the active slide index
        var activeSlide = swiper.slides[activeIndex]; // Get the active slide element

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
}
