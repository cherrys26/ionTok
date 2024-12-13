import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, QueryList, ViewChildren, Renderer2 } from '@angular/core';
import { Swiper } from 'swiper';
import { Challenge } from 'src/app/models/challenge.model';
import { ChallengeService } from '../../services/challenge/challenge.service';
import { LikeService } from 'src/app/services/likes/like.service';
import { TabsPage } from 'src/app/tabs/tabs.page';
import { HomeRefreshService } from 'src/app/services/homeRefresh/home-refresh.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  challenges: Challenge[] = [];
  isLoading: boolean = true; // Track loading state
  activeIndex: number = 0;
  refreshEnabled: boolean = true;
  isMuted:boolean = true;
  showMuteIcon:boolean = false;

  constructor(
    private challengeService: ChallengeService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private likeService: LikeService,
    private tabsPage: TabsPage,
    private homeRefreshService: HomeRefreshService
  ) {}
  @ViewChildren('videoElement') videoElements!: QueryList<HTMLVideoElement>;
  @ViewChildren('innerVideos') innerVideos!: QueryList<HTMLVideoElement>;

  @ViewChild('outerSwiper', { static: false }) outerSwiperRef!: ElementRef;
  outerSwiper!: Swiper | null;

  @ViewChildren('innerSwiper') innerSwiperRefs!: QueryList<ElementRef>;
  innerSwipers: Swiper[] = [];

  ngOnInit() {
    this.loadVideos();
    this.tabsPage.homeTabClickedAgain.subscribe(() => {
      this.handleHomeTabClickedAgain();
    });

    this.homeRefreshService.refreshHome$.subscribe(() => {
      this.loadVideos();
      this.tabsPage.homeTabClickedAgain.subscribe(() => {
        this.handleHomeTabClickedAgain();
      });  
    });
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      console.log("observe")
      entries.forEach(entry => {
        console.log(entry,"entry")
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          video.play().catch(err => console.log('Error playing video:', err));
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.5 });
  
    console.log("loaded")
    document.querySelectorAll('video').forEach(video => observer.observe(video));
  }

  togglePlayPause(videoElement: HTMLVideoElement) {
    console.log(videoElement)

    if (videoElement.paused) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  }

  // Method to toggle mute/unmute
  toggleMute(videoElement: HTMLVideoElement) {
    console.log("toggle", videoElement)

    this.isMuted = !this.isMuted
    videoElement.muted = this.isMuted;

    this.showMuteIcon = true;
    setTimeout(() => {
      this.showMuteIcon = false;
    }, 1000); // Icon will disappear after 1 second

  }

  loadVideos() {
    this.challengeService.getAllChallenges().subscribe({
      next: (response) => {
        this.challenges = response;
        console.log(this.challenges)
        this.isLoading = false; // Hide spinner when videos are loaded
        this.cdr.detectChanges(); // Ensure changes are reflected in the DOM

        requestAnimationFrame(() => {
          this.initializeSwipers(); // Re-initialize Swipers after videos are loaded
        });
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
      this.outerSwiper = new Swiper(this.outerSwiperRef.nativeElement, {
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
  
  slideChanged(e){
    var swiper = e.detail[0];

    console.log(swiper)
    console.log(swiper.activeIndex)
    console.log(this.activeIndex)
    console.log(this.activeIndex)

    console.log(this.challenges[swiper.activeIndex])
    
    console.log(this.videoElements.get(this.activeIndex))

    console.log(this.innerVideos)

    if(this.isMuted)

    if(swiper.isVertical())
      this.activeIndex = swiper.activeIndex;

    if(swiper.isHorizontal())
    {
      console.log(this.activeIndex)
      console.log(swiper.activeIndex)
    }

    console.log(swiper.slides[0])
    if((swiper.isVertical() && swiper.activeIndex == 0) || (swiper.isHorizontal() && swiper.slides[0].classList.contains("slide-index-0")))
      this.refreshEnabled = true;
    else
      this.refreshEnabled = false;
  }

  innerslideChanged(e){
    console.log(e)
  }

  refresh(event) {
      setTimeout(() => {
        this.loadVideos();
        requestAnimationFrame(() => {
          this.initializeSwipers();
        });
          event.target.complete();
      }, 1500);
  }

  handleHomeTabClickedAgain() {
    this.cdr.detectChanges();
    this.outerSwiper.update()
  }

  onVideoLoad(event: Event) {
    console.log(event)
    const videoElement = event.target as HTMLVideoElement;
    videoElement.play().catch(error => console.log('Video play error:', error));
  }
}
