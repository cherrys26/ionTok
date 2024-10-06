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

  constructor(private challengeService: ChallengeService, private cdr: ChangeDetectorRef, private renderer: Renderer2) {}

  @ViewChild('outerSwiper', { static: false }) outerSwiperRef!: ElementRef;
  outerSwiper!: Swiper | null;

  @ViewChildren('innerSwiper') innerSwiperRefs!: QueryList<ElementRef>;
  innerSwipers: Swiper[] = [];

  ngOnInit() {
    this.loadVideos();
  }

  ngAfterViewInit() {
    // Use requestAnimationFrame to ensure DOM rendering is complete before initializing Swipers
    requestAnimationFrame(() => {
      this.initializeSwipers();
    });
  }

  loadVideos() {
    this.challengeService.getAllChallenges().subscribe(
      (response) => {
        this.challenges = response;
        this.cdr.detectChanges(); // Ensure changes are reflected in the DOM
        requestAnimationFrame(() => {
          this.initializeSwipers(); // Re-initialize Swipers after videos are loaded
        });
      },
      (error) => {
        console.error('Error loading challenges:', error);
      }
    );
  }

  initializeSwipers() {
    // Destroy existing Swipers to avoid conflicts
    if (this.outerSwiper) {
      this.outerSwiper.destroy(true, true);
    }

    // Initialize outer (vertical) Swiper
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

    // Initialize inner (horizontal) Swipers
    this.innerSwipers.forEach((swiper) => swiper.destroy(true, true)); // Destroy existing inner Swipers
    this.innerSwipers = []; // Clear the array

    this.innerSwiperRefs.forEach((swiperRef: ElementRef, index: number) => {
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

//   pictures: Video[] = [];
//   loadedPictures: Video[] = [];
//   currentIndex = 0;
//   batchSize = 3;
// lastActiveIndex = 0;
//   responsesBatchSize = 3; // Number of related pictures to load at a time
//   page = 1;
//   currentId = 10;  

//   @ViewChild('outerSwiper', { static: false }) outerSwiperRef!: ElementRef;
//   outerSwiper!: Swiper;

//   @ViewChildren('innerSwiper') innerSwiperRefs!: QueryList<ElementRef>;
//   innerSwipers: Swiper[] = [];

//   constructor(private videoService: VideoService, private cdr: ChangeDetectorRef) { }

//   ngOnInit() {
//     this.loadVideos(this.page, 3).then(() => {
//       if (this.pictures.length > 0) {
//           this.currentId = this.pictures[0].id;
//       }
//     });    
//   }

//     ngAfterViewInit() {
//       this.initializeSwipers();
//       }

//       initializeSwipers(){
//         if (this.outerSwiperRef) {
//           this.outerSwiper = this.outerSwiperRef.nativeElement.swiper;
//           this.outerSwiper.on('slideChange', () => {
//             console.log('Outer slide changed');
//             this.onSlideChange();
//           });
//         }

//         this.innerSwiperRefs.forEach((swiperRef: ElementRef, index: number) => {
//           const innerSwiper = swiperRef.nativeElement.swiper;
//           if (innerSwiper) {
//             this.innerSwipers.push(innerSwiper);
//             innerSwiper.on('slideChange', () => {
//               console.log('Inner slide changed');
//               const activeIndex = innerSwiper.activeIndex;
//             });
      
//             // Call update() to refresh swiper after adding new slides
//             innerSwiper.update();
//           }
//         });
//       }

//     loadVideos(pageNumber: number, pageSize: number): Promise<void> {
//       return new Promise((resolve, reject) => {
//           this.videoService.getVideoListFromApi(pageNumber, pageSize).subscribe(
//               (videos) => {
//                   this.pictures.push(...videos);
//                   this.loadNextBatch();
  
//                   // Update swiper after content is loaded
//                   if (this.outerSwiper) {
//                     this.outerSwiper.update();
//                   }
                  
//                   resolve(); // Resolve the promise once videos are loaded
//               },
//               (error) => {
//                   reject(error); // Reject the promise if there's an error
//               }
//           );
//       });
//     }

//     loadNextBatch() {
//         const remainingPictures = this.pictures.slice(this.currentIndex, this.currentIndex + this.batchSize);

//         this.loadedPictures.push(...remainingPictures);
//         this.currentIndex += this.batchSize;

//         this.cdr.detectChanges();
//         if (this.outerSwiper) {
//             this.outerSwiper.update();
//         }
//     }

//     onSlideChange() {
//         const currentIndex = this.outerSwiper.activeIndex;
//         const totalSlides = this.pictures.length;

//         const isApproachingEnd = currentIndex >= this.loadedPictures.length - 1;

//         if (isApproachingEnd && currentIndex < totalSlides)
//         {
//             this.page += 1;
//             this.loadVideos(this.page, 3);
//         }
//         this.lastActiveIndex = currentIndex;
//         this.currentId = this.pictures[currentIndex]?.id || this.currentId;

//         console.log(this.currentId)
//     }

//     checkResponsesLoading(currentIndex: number) {
//         const currentPicture = this.loadedPictures[currentIndex];

//         if (currentPicture && currentPicture.loadedResponses) {
//             const innerSwiper = this.outerSwiperRef.nativeElement.querySelectorAll('swiper-container.swiper-h')[currentIndex].swiper;

//             if (innerSwiper) {
//                 innerSwiper.on('slideChange', () => {
//                     const innerIndex = innerSwiper.activeIndex;

//                     // If there are 2 or fewer responses left, load the next batch
//                     if (currentPicture.responses && innerIndex >= currentPicture.loadedResponses.length - 2) {
//                         const remainingResponses = currentPicture.responses.slice(currentPicture.loadedResponses.length, currentPicture.loadedResponses.length + this.responsesBatchSize);
//                         currentPicture.loadedResponses.push(...remainingResponses);

//                         this.cdr.detectChanges();
//                         innerSwiper.update();
//                     }
//                 });
//             }
//         }
//     }
// }
