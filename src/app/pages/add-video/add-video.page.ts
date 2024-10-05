import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AlertController } from '@ionic/angular';
import { TabsService } from '../../services/tabs/tab.service'; 

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.page.html',
  styleUrls: ['./add-video.page.scss'],
  providers: [MediaCapture]
})
export class AddVideoPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  videoUrl: SafeUrl | null = null;
  description: string = '';
  isVideoSelected: boolean = false;
  isDescriptionAdded: boolean = false;

  constructor(
    private mediaCapture: MediaCapture,
    private sanitizer: DomSanitizer,
    private alertController: AlertController,
    private tabsService: TabsService
  ) {}

  ngOnInit() {}

  ionViewWillLeave() {
    this.tabsService.showTabs();  // Show the tab bar again when leaving the page
  }

  recordVideo() {
    this.tabsService.hideTabs();  // Hide the tab bar when recording a video

    const options: CaptureVideoOptions = {
      limit: 1,
      duration: 30,
    };

    this.mediaCapture.captureVideo(options).then(
      (mediaFiles: MediaFile[]) => {
        const capturedFile = mediaFiles[0];
        const fullPath = capturedFile.fullPath;

        this.videoUrl = this.sanitizer.bypassSecurityTrustUrl('file://' + fullPath);
        this.isVideoSelected = true;
        console.log('Captured video file: ', this.videoUrl);
      },
      (err: CaptureError) => {
        console.error(err);
        this.tabsService.showTabs();  // Show the tab bar if there's an error
      }
    );
  }

  async onFileSelected(event: any) {
    this.tabsService.hideTabs();  // Hide the tab bar when a video is selected

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
          this.isVideoSelected = true;
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
    this.isVideoSelected = false;
  }

  proceedToReview() {
    if (this.description.trim().length > 0) {
      this.isDescriptionAdded = true;
    }
  }

  goBackToEdit() {
    this.isDescriptionAdded = false;
  }

  submit() {
    console.log('Submitting video with description:', this.description);
    // Reset form state
    this.cancel();
  }

  cancel() {
    this.videoUrl = null; // Reset the selected video
    this.description = ''; // Clear the description
    this.isVideoSelected = false; // Reset the selection state
    this.isDescriptionAdded = false; // Go back to the first step
  
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    
    this.tabsService.showTabs(); // Show the tab bar when cancelled
  }
}
