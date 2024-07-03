import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.page.html',
  styleUrls: ['./add-video.page.scss'],
})
export class AddVideoPage implements OnInit {

  videoUrl: string | null = null;
  videoPath: string | null = null;

  constructor(private mediaCapture: MediaCapture) { }

  ngOnInit() { }

  recordVideo() {
    const options: CaptureVideoOptions = {
      limit: 1,
      duration: 30,
    };

    this.mediaCapture.captureVideo(options).then(
      (mediaFiles: MediaFile[]) => {
        let capturedFile = mediaFiles[0];
        let fileName = capturedFile.name;
        let fullPath = capturedFile.fullPath;
        let type = capturedFile.type;
        this.videoPath = capturedFile.fullPath;
        console.log('Captured video file: ', this.videoPath);
        console.log('Captured video file: ', fullPath);
      },
      (err: CaptureError) => console.error(err)
    );
  }

  async selectVideo() {
    const video = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });

    if (video) {
      this.videoUrl = Capacitor.convertFileSrc(video.path);

      console.log('Selected video file: ', this.videoUrl);
    } else {
      console.log('No video selected.');
    }
  }
}
