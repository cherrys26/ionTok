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

interface Picture {
  url: string;
  likes: number;
  username: string;
  relatedPictures?: Picture[];
  loadedRelatedPictures?: Picture[];
}

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, AfterViewInit {
  pictures: Picture[] = [];
  loadedPictures: Picture[] = [];
  currentIndex = 0;
  batchSize = 3;
  lastActiveIndex = 0;

  @ViewChild('outerSwiper', { static: false }) swiperElement!: ElementRef;
  swiperInstance!: Swiper;

  @ViewChildren('innerSwiper') innerSwiperElements!: QueryList<ElementRef>;
  innerSwipers: Swiper[] = []; // Array to hold Swiper instances for inner swipers

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.pictures = [
        {
            url: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
            likes: 120,
            username: 'user1',
            relatedPictures: [
                { url: 'https://www.w3schools.com/w3images/jungle.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/kitchen.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/lighthouse.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/mountains.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/office.jpg', likes: 95, username: 'user2' },
            ]
        },
        {
            url: 'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg', likes: 95, username: 'user2',
            relatedPictures: [
                { url: 'https://www.w3schools.com/w3images/palace.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/plantation.jpg', likes: 95, username: 'user2' },
            ]

        },
        {
            url: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg', likes: 88, username: 'user3',
            relatedPictures: [
                { url: 'https://www.w3schools.com/w3images/pyramid.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/railway.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/sand.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/snow.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/statue.jpg', likes: 95, username: 'user2' },           ]

        },
        {
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBnBAeQw5eAUA&s', likes: 45, username: 'user4',
            relatedPictures: [
                { url: 'https://www.w3schools.com/w3images/tower.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/travel.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/tree.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/village.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/waterfall.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/wildlife.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/winter.jpg', likes: 95, username: 'user2' }
            ]

        },
        {
            url: 'https://fps.cdnpk.net/images/home/subhome-ai.webp?w=649&h=649', likes: 56, username: 'user5',
            relatedPictures: [
                { url: 'https://www.w3schools.com/w3images/africa.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/aquarium.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/astronaut.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/basketball.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/camping.jpg', likes: 95, username: 'user2' }
            ]

        },
        {
            url: 'https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg', likes: 78, username: 'user6',
            relatedPictures: [
                { url: 'https://www.w3schools.com/w3images/cooking.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/cruise.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/cycling.jpg', likes: 95, username: 'user2' },
            ]

        },
        {
            url: 'https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg', likes: 102, username: 'user7',
            relatedPictures: [
                { url: 'https://www.w3schools.com/w3images/driver.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/eiffel.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/fireworks.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/fountains.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/hotel.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/hut.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/icehotel.jpg', likes: 95, username: 'user2' }
            ]

        },
        {
            url: 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630', likes: 90, username: 'user8',
            relatedPictures: [
                { url: 'https://www.w3schools.com/w3images/monument.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/museum.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/park.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/paris.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/pool.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/safari.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/skiing.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/sunrise.jpg', likes: 95, username: 'user2' }, ]

        },
        {
            url: 'https://replicate.delivery/mgxm/0958ab0c-8d26-45f8-a5f1-a27a1f2259cc/baby.jpg', likes: 130, username: 'user9',
            relatedPictures: [
                { url: 'https://www.w3schools.com/w3images/city.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/ny.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/party.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/pizza.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/architecture.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/flowers.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/hiking.jpg', likes: 95, username: 'user2' },
            ]

        },
        {
            url: 'https://pixlr.com/images/index/ai-image-generator-one.webp', likes: 115, username: 'user10',
            relatedPictures: [
                { url: 'https://www.w3schools.com/w3images/landscape.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/sports.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/sunset.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/tour.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/train.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/sky.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/seafood.jpg', likes: 95, username: 'user2' },

            ]

        },
        {
            url: 'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp', likes: 142, username: 'user11',
            relatedPictures: [
                { url: 'https://www.w3schools.com/w3images/rural.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/coffee.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/temple.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/street.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/market.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/river.jpg', likes: 95, username: 'user2' },

            ]

        },
        {
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqGK3diR3Zi-mnOXEaj-3ewmFyRYVxGzVzZw&s', likes: 77, username: 'user12',
            relatedPictures: [
                { url: 'https://www.w3schools.com/w3images/yoga.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/restaurant.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/icecream.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/garden.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/lake.jpg', likes: 95, username: 'user2' },
                { url: 'https://www.w3schools.com/w3images/café.jpg', likes: 95, username: 'user2' }

            ]

        },
    ];

    // Load the first batch of pictures
    this.loadNextBatch();
  }

  ngAfterViewInit() {
    // Initialize the outer swiper instance
    console.log('ngAfterViewInit - Initializing outer swiper...');
    this.swiperInstance = this.swiperElement.nativeElement.swiper;
    if (this.swiperInstance) {
        this.swiperInstance.on('slideChange', () => this.onSlideChange());
    }

        // Initialize the inner swiper instances for related pictures
        this.innerSwiperElements.changes.subscribe(() => {
            console.log('Inner swipers updated.');
            this.updateInnerSwipers();
        });

        // Manually trigger the inner swiper updates after the first batch is loaded
        this.cdr.detectChanges(); // Ensure that the DOM is updated
        setTimeout(() => this.updateInnerSwipers(), 0); // Delay to allow DOM updates
}

  loadNextBatch() {
    console.log('Loading next batch...');
    const remainingPictures = this.pictures.slice(this.currentIndex, this.currentIndex + this.batchSize);
    this.loadedPictures.push(...remainingPictures);
    this.currentIndex += this.batchSize;

    // Initialize loadedRelatedPictures for new pictures
    this.loadedPictures.forEach(picture => {
        if (!picture.loadedRelatedPictures) {
            picture.loadedRelatedPictures = picture.relatedPictures?.slice(0, this.batchSize) || [];
            console.log('Initialized loadedRelatedPictures for picture:', picture);
        }
    });

    // Trigger change detection to update the view
    this.cdr.detectChanges();

    // Update Swiper to recognize the newly loaded slides
    if (this.swiperInstance) {
        this.swiperInstance.update();
    }
}
onSlideChange() {
    const currentIndex = this.swiperInstance.activeIndex;
    console.log('Slide changed - Current index:', currentIndex);

    // Check if we are swiping forward and if we are close to the end of loaded pictures
    if (currentIndex > this.lastActiveIndex && this.swiperInstance.isEnd && this.currentIndex < this.pictures.length) {
        console.log('Loading more pictures...');
        this.loadNextBatch();
    }

    // Update the last active index
    this.lastActiveIndex = currentIndex;
}

updateInnerSwipers() {
    console.log('Updating inner swipers...');
    this.innerSwipers = this.innerSwiperElements.map(el => el.nativeElement.swiper);

    this.innerSwipers.forEach((swiper, index) => {
        if (swiper) {
            // Attach event listeners or other updates here if needed
            swiper.update();
            console.log('Inner swiper at index', index, 'updated.');
            swiper.on('slideChange', () => this.onInnerSlideChange(index));
        }
    });
}

onInnerSlideChange(index: number) {
    console.log('Inner slide change - Swiper index:', index);
    const currentSwiper = this.innerSwipers[index];
    if (!currentSwiper) return;

    const activeIndex = currentSwiper.activeIndex;
    const picture = this.loadedPictures[index];

    console.log('Inner slide active index:', activeIndex);
    console.log('Picture relatedPictures length:', picture.relatedPictures?.length);

    // Check if we are near the end of the related pictures and load more
    if (activeIndex >= (picture.loadedRelatedPictures?.length || 0) - 2) {
        console.log('Loading more related pictures for picture:', picture);
        this.loadNextRelatedPictures(picture);
    }
}

loadNextRelatedPictures(picture: Picture) {
    if (picture.relatedPictures) {
        const alreadyLoaded = picture.loadedRelatedPictures?.length || 0;
        const newPictures = picture.relatedPictures.slice(alreadyLoaded, alreadyLoaded + this.batchSize);

        if (newPictures.length) {
            picture.loadedRelatedPictures.push(...newPictures);
            console.log('Loaded new related pictures:', newPictures);

            // Trigger change detection to update the view
            this.cdr.detectChanges();

            // Update the inner swiper for this picture
            const swiperIndex = this.loadedPictures.indexOf(picture);
            if (this.innerSwipers[swiperIndex]) {
                this.innerSwipers[swiperIndex].update();
                console.log('Inner swiper at index', swiperIndex, 'updated with new related pictures.');
            }
        }
    }
}
}
