import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Platform, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.page.html',
  styleUrls: ['./add-video.page.scss'],
  providers: [MediaCapture]
})
export class AddVideoPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  videoUrl: SafeUrl | null = null;

  constructor(
    private mediaCapture: MediaCapture,
    private sanitizer: DomSanitizer,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Initialization logic can go here if needed in the future
  }

  recordVideo() {
    const options: CaptureVideoOptions = {
      limit: 1,
      duration: 30,
    };

    this.mediaCapture.captureVideo(options).then(
      (mediaFiles: MediaFile[]) => {
        const capturedFile = mediaFiles[0];
        const fullPath = capturedFile.fullPath;

        this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(fullPath);

        console.log('Captured video file: ', this.videoUrl);
      },
      (err: CaptureError) => console.error(err)
    );
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);

      videoElement.onloadedmetadata = () => {
        if (videoElement.duration > 30) {
          this.showAlert();
          this.resetFileInput();
        } else {
          this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(videoElement.src);
          console.log('Selected video URL:', this.videoUrl);
        }
      };
    }
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'The selected video is longer than 30 seconds. Please select a shorter video.',
      buttons: ['OK']
    });

    await alert.present();
  }

  resetFileInput() {
    this.fileInput.nativeElement.value = '';
    this.videoUrl = null;
  }
}