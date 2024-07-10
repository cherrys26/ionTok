import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.page.html',
  styleUrls: ['./add-video.page.scss'],
})
export class AddVideoPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  videoUrl: string | null = null;
  videoPath: string | null = null;

  constructor(private mediaCapture: MediaCapture, private alertController: AlertController) { }

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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);

      videoElement.onloadedmetadata = () => {
        if (videoElement.duration > 30) {
          this.showAlert();
          this.resetFileInput();
        } else {
          this.videoUrl = videoElement.src;
          console.log('Selected video URL:', this.videoUrl);
          // Now you can use this.videoUrl for further operations like upload or display
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
