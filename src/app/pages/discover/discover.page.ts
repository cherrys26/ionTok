import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../services/data.service";
import { Swiper } from 'swiper/types';

@Component({
    selector: 'app-discover',
    templateUrl: './discover.page.html',
    styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
    @ViewChild('swiper')
    swiperRef: ElementRef | undefined;
    swiper?: Swiper
 
    swiperReady(){
      this.swiper = this.swiperRef?.nativeElement.swiper
    }    
    
    hideIcon: boolean = false;
    options = {
        loop: true,
        autoplay: true
    }
    optionsTrends = {
        slidesPerView: 5,
        spaceBetween: 1,
        freeMode: true
    }

    trends: any = [];
    slides: any = [];

    constructor(private data: DataService) {
    }

    ngOnInit() {
        this.slides = this.data.getSlides();
        this.trends = this.data.getTrends();
    }

    onFocus(event: any) {
        this.hideIcon = true;
    }

    lossFocus(event: any) {
        this.hideIcon = false;
    }

}
