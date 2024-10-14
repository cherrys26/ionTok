import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements AfterViewInit {
  @Input() video: any;  // Input for the video object
  @ViewChild('descriptionElement') descriptionElement: ElementRef;  // Access to description element

  isExpanded: boolean = false;
  showToggleButton: boolean = false;

  ngAfterViewInit() {
    this.video.userName = this.video.userName
    // Check if the description overflows
    if (this.video?.description && this.video.description.length > 100) {
      this.showToggleButton = true;
    } else {
      this.showToggleButton = false;
    }
  }

  toggleDescription() {
    this.isExpanded = !this.isExpanded;
  }
}
