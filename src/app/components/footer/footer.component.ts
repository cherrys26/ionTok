import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements AfterViewInit {
  @Input() video: any;  // Input for the video object
  @ViewChild('descriptionElement') descriptionElement: ElementRef;  // Access to description element
  @ViewChild('elementRef', { static: false }) elementRef: ElementRef;

  isExpanded: boolean = false;
  showToggleButton: boolean = false;

  ngAfterViewInit() {
    this.video.userName = this.video.userName
    // Check if the description overflows
    if (this.elementRef) {
      // Now it's safe to access the nativeElement
      const element = this.elementRef.nativeElement;
      // Do something with the element
    }
  }

  toggleDescription() {
    this.isExpanded = !this.isExpanded;
  }
}
