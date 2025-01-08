import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, QueryList, ViewChildren } from '@angular/core';
import { Swiper } from 'swiper';
import { Challenge } from 'src/app/models/challenge.model';
import { ChallengeService } from '../../services/challenge/challenge.service';
import { TabsPage } from 'src/app/tabs/tabs.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  challenges: Challenge[] = [];
  challengeCount: number = 0;
  isLoading: boolean = true; // Track loading state
  activeIndex: number = 0;
  refreshEnabled: boolean = true;
  isMuted:boolean = true;
  showMuteIcon:boolean = false;
  currentPage = 1;
  isLoadingMore = false;

  constructor(
    private challengeService: ChallengeService,
    private cdr: ChangeDetectorRef,
    private tabsPage: TabsPage,
  ) {}

  videoId: string = '0-0';

  activeOuterIndex: number = 0; // Currently active outer swiper index
  activeInnerIndexMap: Map<number, string> = new Map(); // Maps outer slide index to the active inner swiper index
  
  @ViewChild('outerSwiper', { static: false }) outerSwiperRef!: ElementRef;
  outerSwiper!: Swiper | null;

  @ViewChildren('innerSwiper') innerSwiperRefs!: QueryList<ElementRef>;
  innerSwipers: Swiper[] = [];

  ngOnInit() {
    this.challengesCount();
    this.loadVideos(this.currentPage);
    this.tabsPage.homeTabClickedAgain.subscribe(() => {
      this.handleHomeTabClickedAgain();
    });
  } 

  ionViewWillEnter() {
    // Play the video when entering the page
    var video = document.getElementById(this.videoId) as HTMLVideoElement;

    if (video) {
      video.play();
    }
  }

  ionViewDidLeave() {
    // Pause the video when leaving the page
    var video = document.getElementById(this.videoId) as HTMLVideoElement;
    if (video) {
      video.pause();
    }
  }

  ngOnDestroy() {
    // Ensure the video is paused when the component is destroyed
    var video = document.getElementById(this.videoId) as HTMLVideoElement;

    if (video) {
      video.pause();
    }
  }

  // Method to toggle mute/unmute
  toggleMute(videoElement: HTMLVideoElement) {
    this.isMuted = !this.isMuted
    videoElement.muted = this.isMuted;

    this.showMuteIcon = true;
    setTimeout(() => {
      this.showMuteIcon = false;
    }, 1000);

  }

  challengesCount() {
    this.challengeService.getChallengesCount().subscribe({
      next: (response) => {
        this.challengeCount = response;
      },
      error: (error) => {
        console.error('Error loading count');
      }
    })
  }

  loadVideos(page: number) {
    this.challengeService.getAllChallenges(page).subscribe({
      next: (response) => {
        this.challenges.push(...response); // Append new challenges
        this.isLoading = false; // Hide spinner when videos are loaded
        this.cdr.detectChanges(); // Ensure changes are reflected in the DOM

        requestAnimationFrame(() => {
          this.initializeSwipers(); // Re-initialize Swipers after videos are loaded
        });
        var video = document.getElementById(this.videoId) as HTMLVideoElement
        if(video)
          video.play() 
      },
      error: (error) => {
        console.error('Error loading challenges:', error);
        this.isLoading = false; // Hide spinner even on error
      }
    });
  }

  initializeSwipers() {
    if (this.outerSwiper) {
      this.outerSwiper.destroy(true, true);
    }

    if (this.outerSwiperRef && this.outerSwiperRef.nativeElement.swiper) {
      new Swiper(this.outerSwiperRef.nativeElement, {
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 10,
        on: {
          slideChange: (event) => {
          },
          
        },
      });
    }

    this.innerSwipers.forEach((swiper) => swiper.destroy(true, true));
    this.innerSwipers = [];

    this.innerSwiperRefs.forEach((swiperRef: ElementRef) => {
      const innerSwiperElement = swiperRef.nativeElement;
      if (innerSwiperElement) {
        const innerSwiper = new Swiper(innerSwiperElement, {
          direction: 'horizontal',
          slidesPerView: 1,
          spaceBetween: 10,
          on: {
            slideChange: (event) => {
            },  
          }
        });

        this.innerSwipers.push(innerSwiper);
      }
    });
  }
  
  slideChanged(e) {
    var previousVideo = document.getElementById(this.videoId) as HTMLVideoElement;
    if (previousVideo && typeof previousVideo.pause === 'function') {
      previousVideo.pause();
    }

    var swiper = e.detail[0];
    var activeIndex = swiper.activeIndex; // Get the active slide index
    var activeSlide = swiper.slides[activeIndex]; // Get the active slide element

    if(this.activeInnerIndexMap.get(activeIndex)) {
      this.videoId = this.activeInnerIndexMap.get(activeIndex);
    }
    else {
      var videoElement = activeSlide.querySelector('video') as HTMLVideoElement;
      if(videoElement)
        this.videoId = videoElement.id;
      else{
        var imgElement = activeSlide.querySelector('img');
        if(imgElement)
          this.videoId = imgElement.id
      }
    }

    var newVideo = document.getElementById(this.videoId) as HTMLVideoElement;

    if (newVideo && typeof newVideo.play === 'function') {
      newVideo.play().catch(err => console.error('Error playing video:', err));
      newVideo.muted = this.isMuted;
    }

    // Handle refresher enable/disable
    if((swiper.isVertical() && swiper.activeIndex == 0) || (swiper.isHorizontal() && swiper.slides[0].classList.contains("slide-index-0")))
      this.refreshEnabled = true;
    else
      this.refreshEnabled = false;   

      var direction = activeIndex > this.activeOuterIndex ? 'down' : 'up';

      if(swiper.isVertical())
        this.activeOuterIndex = activeIndex

      if (swiper.isVertical() && direction === 'down' && this.challengeCount > this.challenges.length && activeIndex === this.challenges.length - 3 && !this.isLoadingMore) {
        this.currentPage++;
        this.loadVideos(this.currentPage);
      }
  }

  innerslideChanged(event) {
    var swiper = event.detail[0];
  
    // Update the map with the active inner index for the current outer slide
    this.activeInnerIndexMap.set(this.activeOuterIndex, `${this.activeOuterIndex}-${swiper.activeIndex}`);
  }
  

  refresh(event) {
      setTimeout(() => {
        this.currentPage = 1;
        this.challengesCount()
        this.challenges = [];
        this.loadVideos(this.currentPage);
        this.activeInnerIndexMap = new Map();
        event.target.complete();
      }, 1500);
  }

  handleHomeTabClickedAgain() {
    var previousVideo = document.getElementById(this.videoId) as HTMLVideoElement;
    if (previousVideo && typeof previousVideo.pause === 'function') {
      previousVideo.pause();
    }

    this.videoId = "0-0";
    this.activeOuterIndex = 0;
    var newVideo = document.getElementById(this.videoId) as HTMLVideoElement;
    if (newVideo && typeof newVideo.play === 'function') {
      newVideo.play().catch(err => console.error('Error playing video:', err));
      newVideo.muted = this.isMuted;
    }

    if (this.outerSwiperRef.nativeElement.swiper) {
      this.outerSwiperRef.nativeElement.swiper.update(); // Ensure outerSwiper is updated
    }
    this.refreshEnabled = true;
    this.cdr.detectChanges();
  }
}
