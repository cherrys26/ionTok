import {Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {DataService} from "../../services/data.service";
import { Swiper } from 'swiper';
import LazyLoad from 'vanilla-lazyload';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
    @ViewChild('swiper')
    swiperRef: ElementRef | undefined;
    swiper?: Swiper
 
    swiperReady(){
      this.swiper = this.swiperRef?.nativeElement.swiper
    }    
    
    videoList: any = [];

    constructor(private data: DataService) {
    }

    ngOnInit() {
        this.videoList = this.data.getVideoList();        
    }

    ngAfterViewInit() {
        // Initialize LazyLoad after view is initialized
        new LazyLoad({
          elements_selector: '.lazy'
        });
      }
}
