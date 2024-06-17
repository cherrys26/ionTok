import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.page.html',
  styleUrls: ['./add-video.page.scss'],
})
export class AddVideoPage implements OnInit {
  videoUrl: SafeResourceUrl = ''; 
  isVideoAvailable = false;

  constructor(private camera: Camera, private sanitizer: DomSanitizer) { }

  async takeVideo(sourceType: number) { 
    const options: CameraOptions = {
      quality: 90,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      mediaType: this.camera.MediaType.VIDEO,
    };

    try {
      const videoUrl = await this.camera.getPicture(options);

      // Sanitize the URL for security
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);

      this.isVideoAvailable = true; 
    } catch (error) {
      console.error('Error taking video:', error);
    }
  }
  
  ngOnInit() {
  }

}
