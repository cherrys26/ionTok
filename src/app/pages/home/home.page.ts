import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, QueryList, ViewChildren, Renderer2 } from '@angular/core';
import { Swiper } from 'swiper';
import { Challenge } from 'src/app/models/challenge.model';
import { ChallengeService } from '../../services/challenge/challenge.service';
import { LikeService } from 'src/app/services/likes/like.service';
import { TabsPage } from 'src/app/tabs/tabs.page';

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

  constructor(
    private challengeService: ChallengeService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private likeService: LikeService,
    private tabsPage: TabsPage
  ) {}

  @ViewChild('outerSwiper', { static: false }) outerSwiperRef!: ElementRef;
  outerSwiper!: Swiper | null;

  @ViewChildren('innerSwiper') innerSwiperRefs!: QueryList<ElementRef>;
  innerSwipers: Swiper[] = [];

  ngOnInit() {
    this.loadVideos();
    this.tabsPage.homeTabClickedAgain.subscribe(() => {
      this.handleHomeTabClickedAgain();
    });
  }

  ngAfterViewInit() {

  }

  loadVideos() {
    this.challengeService.getAllChallenges().subscribe({
      next: (response) => {
        this.challenges = response;
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
          spaceBetween: 10
        });

        this.innerSwipers.push(innerSwiper);
      }
    });
  }
  
  slideChanged(e){
    var swiper = e.detail[0];

    if((swiper.isVertical() && swiper.activeIndex == 0) || (swiper.isHorizontal() && swiper.slides[0].classList.contains("slide-index-0")))
      this.refreshEnabled = true;
    else
      this.refreshEnabled = false;
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
}
