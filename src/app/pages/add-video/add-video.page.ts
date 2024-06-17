// import { Component, OnInit } from '@angular/core';
// import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@awesome-cordova-plugins/media-capture/ngx';
// import { Platform } from '@ionic/angular'; // Import Platform

// @Component({
//   selector: 'app-add-video',
//   templateUrl: './add-video.page.html',
//   styleUrls: ['./add-video.page.scss'],
// })
// export class AddVideoPage implements OnInit {
//   videoUrl: SafeResourceUrl = '';
//   isVideoAvailable = false;
//   errorMessage: string | null = null;

//   constructor(private mediaCapture: MediaCapture, private sanitizer: DomSanitizer, private platform: Platform) {}

//   async captureVideo() {
//     // Check if the platform supports video capture
//     if (!this.platform.is('cordova')) {
//       console.warn('Video capture is not supported in this environment.');
//       return;
//     }

//     const options: CaptureVideoOptions = {
//       limit: 1,
//       duration: 30
//     };

//     this.mediaCapture.captureVideo(options)
//       .then((mediaFiles: MediaFile[]) => {
//         if (mediaFiles.length > 0) {
//           const videoFile: MediaFile = mediaFiles[0];
//           const videoUrl = videoFile.fullPath;
//           this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
//           this.isVideoAvailable = true;
//           this.errorMessage = null;
//         }
//       })
//       .catch((error: CaptureError) => {
//         console.error('Error capturing video:', error.code);
//         this.errorMessage = `Error capturing video: ${error.code}`;
//         this.isVideoAvailable = false;
//       });
//   }

//   async selectVideoFromGallery() {
//     if (!this.platform.is('cordova')) {
//       console.warn('Video selection is not supported in this environment.');
//       return;
//     }
  
//     const options: CaptureVideoOptions = {
//       limit: 1,
//       duration: 0
//     };
  
//     this.mediaCapture.captureVideo(options)
//       .then((result: MediaFile[] | CaptureError) => {
//         if (result instanceof CaptureError) {
//           console.error('Error selecting video:', result.code);
//           this.errorMessage = `Error selecting video: ${result.code}`;
//           this.isVideoAvailable = false;
//           return; 
//         }
  
//         const mediaFiles = result as MediaFile[];
  
//         if (mediaFiles.length > 0) {
//           const videoFile: MediaFile = mediaFiles[0];
//           const videoUrl = videoFile.fullPath;
//           this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
//           this.isVideoAvailable = true;
//           this.errorMessage = null;
//         }
//       })
//       .catch((error: any) => { 
//         console.error('Unexpected error:', error); 
//         // Handle unexpected errors
//       });
//   }

//   ngOnInit() {
//   }

// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.page.html',
  styleUrls: ['./add-video.page.scss'],
})

export class AddVideoPage implements OnInit {
  videoUrl: SafeResourceUrl;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const videoPath = params['videoUrl'];
      if (videoPath) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoPath);
      }
    });
  }
}
