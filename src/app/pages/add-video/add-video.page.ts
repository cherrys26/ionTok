import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@awesome-cordova-plugins/media-capture/ngx';
import { Platform } from '@ionic/angular'; // Import Platform

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.page.html',
  styleUrls: ['./add-video.page.scss'],
})
export class AddVideoPage implements OnInit {
  videoUrl: SafeResourceUrl = '';
  isVideoAvailable = false;
  errorMessage: string | null = null; // Store error message

  constructor(private mediaCapture: MediaCapture, private sanitizer: DomSanitizer, private platform: Platform) {}

  async takeVideo() {
    // Check if the platform supports video capture
    if (!this.platform.is('cordova')) {
      console.warn('Video capture is not supported in this environment.');
      return;
    }

    const options: CaptureVideoOptions = {
      limit: 1,
      duration: 30
    };

    this.mediaCapture.captureVideo(options)
      .then((mediaFiles: MediaFile[]) => { // Success: mediaFiles is MediaFile[]
        if (mediaFiles.length > 0) {
          const videoFile: MediaFile = mediaFiles[0];
          const videoUrl = videoFile.fullPath;
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
          this.isVideoAvailable = true;
          this.errorMessage = null; // Clear any previous error message
        }
      })
      .catch((error: CaptureError) => { // Error: error is CaptureError
        console.error('Error capturing video:', error.code);
        this.errorMessage = `Error capturing video: ${error.code}`;
        this.isVideoAvailable = false; // Hide the video element in case of error
      });
  }

  ngOnInit() {
  }

}
