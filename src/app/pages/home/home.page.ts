import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../services/data.service";
import { Swiper } from 'swiper/types';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    @ViewChild('swiper')
    swiperRef: ElementRef | undefined;
    swiper?: Swiper
 
    swiperReady(){
      this.swiper = this.swiperRef?.nativeElement.swiper
    }    
    
    videoList: any = [];
    videoList123: any = [];

    constructor(private data: DataService) {
    }

    ngOnInit() {
        this.videoList = this.data.getVideoList();
        this.videoList123 = this.data.getVideoList();
    }

}
