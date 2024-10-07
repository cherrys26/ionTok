import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AlertController, NavController } from '@ionic/angular';
import { TabsService } from '../../services/tabs/tab.service'; 
import { ChallengeService } from '../../services/challenge/challenge.service';

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
  selectedVideoFile: File | null = null; // Store the selected video file

  constructor(
    private mediaCapture: MediaCapture,
    private sanitizer: DomSanitizer,
    private alertController: AlertController,
    private tabsService: TabsService,
    private challengeService: ChallengeService, // Inject the video upload service
    private navCtrl: NavController // <-- Inject NavController
  ) {}

  ngOnInit() {
    this.tabsService.hideTabs();
  }
  ngAfterViewInit() {
    this.fileInput.nativeElement.click()
  }
  ionViewWillLeave() {
    this.tabsService.showTabs(); // Show the tab bar again when leaving the page
  }

  recordVideo() {
    this.tabsService.hideTabs(); // Hide the tab bar when the page is initialized

    const options: CaptureVideoOptions = {
      limit: 1,
      duration: 30,
    };

    this.mediaCapture.captureVideo(options).then(
      (mediaFiles: MediaFile[]) => {
        const capturedFile = mediaFiles[0];
        const fullPath = capturedFile.fullPath;

        // Convert MediaFile to Blob
        fetch(fullPath)
          .then(res => res.blob())
          .then(blob => {
            this.selectedVideoFile = new File([blob], 'capturedVideo.mp4', { type: 'video/mp4' }); // Create a File object for the captured video
            this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
            this.isVideoSelected = true;
            console.log('Captured video file: ', this.videoUrl);
          })
          .catch(err => {
            console.error('Error fetching video blob:', err);
            this.tabsService.showTabs(); // Show the tab bar again when leaving the page
          });
      },
      (err: CaptureError) => {
        console.error(err);
        this.tabsService.showTabs(); // Show the tab bar again when leaving the page
      }
    );
  }

  async onFileSelected(event: any) {
    this.tabsService.hideTabs(); // Hide the tab bar when the page is initialized

    const file: File = event.target.files[0];

    if (file) {
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);

      const fileSizeMB = file.size / (1024 * 1024); // Convert file size from bytes to MB

      if (fileSizeMB > 30) { // Check if file size exceeds 30MB
        this.showErrorAlert('The selected video is too large. Please select a video less than 30MB.');
      }
      else{
        videoElement.onloadedmetadata = () => {
          if (videoElement.duration > 31) {
            this.showErrorAlert("The selected video is longer than 30 seconds. Please select a shorter video.");
            this.resetFileInput();
          } else {
            this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(videoElement.src);
            this.isVideoSelected = true;
            this.selectedVideoFile = file; // Store the selected video file
            console.log('Selected video URL:', this.videoUrl);
          }
        };
      }
    }
  }

  async showErrorAlert(message: string) {
    this.tabsService.showTabs(); // Show the tab bar again when leaving the page

    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  resetFileInput() {
    this.fileInput.nativeElement.value = '';
    this.videoUrl = null;
    this.isVideoSelected = false;
    this.selectedVideoFile = null; // Reset selected video file
  }

  proceedToReview() {
    if (this.description.trim().length > 0) {
      this.isDescriptionAdded = true;
    }
  }

  goBackToEdit() {
    this.isDescriptionAdded = false;
  }

  async submit() {
    if (this.selectedVideoFile) {
      try {
        const challengeType = 'VIDEO'; // Set your challenge type accordingly
        await this.challengeService.uploadChallenge(this.description, challengeType, this.selectedVideoFile).toPromise();

        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Challenge Accepted!',
          buttons: [{
            text:'OK',
            handler: () => {
              this.cancel();
            }
          }]
        });
    
        await alert.present();      
      } catch (error) {
        console.error('Error submitting video:', error);
      }
    }
  }

  cancel() {
    this.selectedVideoFile = null;
    this.videoUrl = null; // Reset the selected video
    this.description = null; // Clear the description
    this.isVideoSelected = false; // Reset the selection state
    this.isDescriptionAdded = false; // Go back to the first step
  
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.navCtrl.back();

  }
}
