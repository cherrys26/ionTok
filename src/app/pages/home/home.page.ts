import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, QueryList, ViewChildren } from '@angular/core';
import { Swiper } from 'swiper';
import { VideoService } from '../../services/video/video.service';
import { Video } from '../../models/video.model';
import { Response } from '../../models/response.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('outerSwiper', { static: false }) outerSwiperRef!: ElementRef;
  @ViewChildren('innerSwiper') innerSwiperRefs!: QueryList<ElementRef>;

  outerSwiper?: Swiper;
  innerSwiperInstances: Swiper[] = [];

  videoList: Video[] = [];
  loadingVideos = false;
  loadingResponses = new Map<number, boolean>();

  constructor(private videoService: VideoService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadInitialVideos();
  }

  ngAfterViewInit() {
    this.initializeSwipers();
  }

  private loadInitialVideos() {
    this.videoService.getStaticVideoList().subscribe((videos) => {
      this.videoList = videos;
    });
  }

  private loadResponses(videoId: number) {
    this.loadingResponses.set(videoId, true);
    this.videoService.getResponsesForVideo(videoId).subscribe((responses) => {
      const video = this.videoList.find((v) => v.id === videoId);
      if (video) {
        video.responses = responses;
      }
      this.loadingResponses.set(videoId, false);
    });
  }

  private loadMoreVideos() {
    if (this.loadingVideos) return;

    this.loadingVideos = true;
    this.videoService.loadMoreVideos().subscribe((videos) => {
      this.videoList.push(...videos);
      videos.forEach((video) => {
        this.loadResponses(video.id);
      });
      this.loadingVideos = false;
      this.cdr.detectChanges(); // Trigger change detection manually
    });
  }

  private loadMoreResponses(videoId: number) {
    if (this.loadingResponses.get(videoId)) return;

    this.loadingResponses.set(videoId, true);
    this.videoService.getResponsesForVideo(videoId).subscribe((responses) => {
      const video = this.videoList.find((v) => v.id === videoId);
      if (video) {
        video.responses.push(...responses);
      }
      this.loadingResponses.set(videoId, false);
    });
  }

  private initializeSwipers() {
    if (this.outerSwiperRef) {
      this.outerSwiper = this.outerSwiperRef.nativeElement.swiper;
      this.outerSwiper.on('slideChange', () => {
        console.log('Outer slide changed');
        const activeIndex = this.outerSwiper.activeIndex;
        console.log('Outer swipe active index:', activeIndex);
  
        // Load more videos when reaching the second-to-last slide
        if (activeIndex > this.videoList.length - 2) {
          this.loadMoreVideos();
        }
      });
    }
  
    // Initialize each inner Swiper
    this.innerSwiperRefs.forEach((swiperRef: ElementRef, index: number) => {
      const innerSwiper = swiperRef.nativeElement.swiper;
      if (innerSwiper) {
        this.innerSwiperInstances.push(innerSwiper);
        innerSwiper.on('slideChange', () => {
          console.log('Inner slide changed');
          const video = this.videoList[index];
          const activeIndex = innerSwiper.activeIndex;
          console.log('Inner swipe active index:', activeIndex);
  
          // Load more responses when reaching the second-to-last response slide
          if (activeIndex > video.responses.length - 2) {
            this.loadMoreResponses(video.id);
          }
        });
  
        // Call update() to refresh swiper after adding new slides
        innerSwiper.update();
      }
    });
  }
}
