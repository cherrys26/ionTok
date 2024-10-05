import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, QueryList, ViewChildren } from '@angular/core';
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
  
  constructor(private challengeService: ChallengeService, private cdr: ChangeDetectorRef) { }

  @ViewChild('outerSwiper', { static: false }) outerSwiperRef!: ElementRef;
  outerSwiper!: Swiper;

  @ViewChildren('innerSwiper') innerSwiperRefs!: QueryList<ElementRef>;
  innerSwipers: Swiper[] = [];

  ngOnInit() {
    this.loadVideos();
  }

  ngAfterViewInit() {
    // Don't initialize Swipers until the data is loaded
    this.cdr.detectChanges();
  }
  
  loadVideos() {
    this.challengeService.getAllChallenges().subscribe(
      async (response) => {
        this.challenges = response;

        // Trigger change detection and then initialize Swipers
        this.cdr.detectChanges();
        this.initializeSwipers();
      },
      async (error) => {
        let errorMessages: string[] = [];

        if (error.error) {
          // Iterate through each error and gather messages
          for (const key of Object.keys(error.error)) {
            if (Array.isArray(error.error[key])) {
              errorMessages = errorMessages.concat(error.error[key]);
            } else {
              errorMessages.push(error.error[key]);
            }
          }
        }
        console.log(error, errorMessages);
      }
    );
  }
  
  initializeSwipers() {
    // Initialize outer (vertical) Swiper
    if (this.outerSwiperRef && this.outerSwiperRef.nativeElement.swiper) {
      this.outerSwiper = this.outerSwiperRef.nativeElement.swiper;
    }

    // Initialize inner (horizontal) Swipers
    this.innerSwiperRefs.forEach((swiperRef: ElementRef, index: number) => {
      const innerSwiperElement = swiperRef.nativeElement;
      if (innerSwiperElement && innerSwiperElement.swiper) {
        const innerSwiper = innerSwiperElement.swiper;
        this.innerSwipers.push(innerSwiper);

        // Ensure swiper updates are called when new slides are added
        innerSwiper.update();
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
