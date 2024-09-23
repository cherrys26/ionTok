// import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
// import {DataService} from "../../services/data.service";
// import { Swiper } from 'swiper/types';

// @Component({
//     selector: 'app-discover',
//     templateUrl: './discover.page.html',
//     styleUrls: ['./discover.page.scss'],
// })
// export class DiscoverPage implements OnInit {
//     @ViewChild('swiper')
//     swiperRef: ElementRef | undefined;
//     swiper?: Swiper

//     swiperReady(){
//       this.swiper = this.swiperRef?.nativeElement.swiper
//     }    

//     hideIcon: boolean = false;
//     options = {
//         loop: true,
//         autoplay: true
//     }
//     optionsTrends = {
//         slidesPerView: 5,
//         spaceBetween: 1,
//         freeMode: true
//     }

//     trends: any = [];
//     slides: any = [];

//     constructor(private data: DataService) {
//     }

//     ngOnInit() {
//         this.slides = this.data.getSlides();
//         this.trends = this.data.getTrends();
//     }

//     onFocus(event: any) {
//         this.hideIcon = true;
//     }

//     lossFocus(event: any) {
//         this.hideIcon = false;
//     }

// }
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, QueryList, ViewChildren } from '@angular/core';
import { Swiper } from 'swiper';
import { VideoService } from '../../services/video/video.service';
import { Video } from '../../models/video.model';
import { Response } from '../../models/response.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, AfterViewInit {
  pictures: Video[] = [];
  loadedPictures: Video[] = [];
  currentIndex = 0;
  batchSize = 3;
  lastActiveIndex = 0;
  responsesBatchSize = 3; // Number of related pictures to load at a time

  @ViewChild('outerSwiper', { static: false }) swiperElement!: ElementRef;
  swiperInstance!: Swiper;

  constructor(private videoService: VideoService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.videoService.getStaticVideos().subscribe((videos) => {
        this.pictures = videos;
      });

        this.loadNextBatch();
    }

    ngAfterViewInit() {
        this.swiperInstance = this.swiperElement.nativeElement.swiper;
        if (this.swiperInstance) {
            this.swiperInstance.on('slideChange', () => this.onSlideChange());
        }
    }

    loadNextBatch() {
        const remainingPictures = this.pictures.slice(this.currentIndex, this.currentIndex + this.batchSize);
        remainingPictures.forEach(picture => {
            // Load the first batch of responses for each picture
            if (picture.responses && picture.responses.length > 0) {
                picture.loadedResponses = picture.responses.slice(0, this.responsesBatchSize);
            }
        });
        this.loadedPictures.push(...remainingPictures);
        this.currentIndex += this.batchSize;

        this.cdr.detectChanges();
        if (this.swiperInstance) {
            this.swiperInstance.update();
        }
    }

    onSlideChange() {
        const currentIndex = this.swiperInstance.activeIndex;
        if (currentIndex > this.lastActiveIndex && this.swiperInstance.isEnd && this.currentIndex < this.pictures.length) {
            this.loadNextBatch();
        }
        this.lastActiveIndex = currentIndex;

        // Trigger inner swiper checks for responses
        this.checkResponsesLoading(currentIndex);
    }

    checkResponsesLoading(currentIndex: number) {
        const currentPicture = this.loadedPictures[currentIndex];

        if (currentPicture && currentPicture.loadedResponses) {
            const innerSwiper = this.swiperElement.nativeElement.querySelectorAll('swiper-container.swiper-h')[currentIndex].swiper;

            if (innerSwiper) {
                innerSwiper.on('slideChange', () => {
                    const innerIndex = innerSwiper.activeIndex;

                    // If there are 2 or fewer responses left, load the next batch
                    if (currentPicture.responses && innerIndex >= currentPicture.loadedResponses.length - 2) {
                        const remainingResponses = currentPicture.responses.slice(currentPicture.loadedResponses.length, currentPicture.loadedResponses.length + this.responsesBatchSize);
                        currentPicture.loadedResponses.push(...remainingResponses);

                        this.cdr.detectChanges();
                        innerSwiper.update();
                    }
                });
            }
        }
    }
}
