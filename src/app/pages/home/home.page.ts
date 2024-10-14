import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, QueryList, ViewChildren, Renderer2 } from '@angular/core';
import { Swiper } from 'swiper';
import { Challenge } from 'src/app/models/challenge.model';
import { ChallengeService } from '../../services/challenge/challenge.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  challenges: Challenge[] = [];
  isLoading: boolean = true; // Track loading state

  constructor(
    private challengeService: ChallengeService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  @ViewChild('outerSwiper', { static: false }) outerSwiperRef!: ElementRef;
  outerSwiper!: Swiper | null;

  @ViewChildren('innerSwiper') innerSwiperRefs!: QueryList<ElementRef>;
  innerSwipers: Swiper[] = [];

  ngOnInit() {
    this.loadVideos();
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      this.initializeSwipers();
    });
  }

  loadVideos() {
    this.challengeService.getAllChallenges().subscribe(
      (response) => {
        this.challenges = response;
        this.isLoading = false; // Hide spinner when videos are loaded
        this.cdr.detectChanges(); // Ensure changes are reflected in the DOM

        requestAnimationFrame(() => {
          this.initializeSwipers(); // Re-initialize Swipers after videos are loaded
        });
      },
      (error) => {
        console.error('Error loading challenges:', error);
        this.isLoading = false; // Hide spinner even on error
      }
    );
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
          slideChange: () => {
            console.log('Outer slide changed');
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
            slideChange: () => {
              console.log('Inner slide changed');
            },
          },
        });

        this.innerSwipers.push(innerSwiper);
      }
    });
  }
}
