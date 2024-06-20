import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';
@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.page.html',
  styleUrls: ['./add-video.page.scss'],
})
export class AddVideoPage implements OnInit {

  videoUrl: SafeResourceUrl = '';

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() { }

  async takeVideo() {
    if (Capacitor.getPlatform() !== 'android') {
      console.warn('This functionality is specific to Android.');
      return;
    }

    try {
      const video = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 90,
        saveToGallery: true, // Optionally save to gallery
      });

      if (video && video.webPath) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(video.webPath);
      }
    } catch (err) {
      console.error('Error capturing video:', err);
      // Handle errors here (e.g., permissions not granted)
    }
  }
}
