import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AlertController, NavController } from '@ionic/angular';
import { TabsService } from '../../services/tabs/tab.service'; 
import { ChallengeService } from '../../services/challenge/challenge.service';
import { Router } from '@angular/router';
import { HomeRefreshService } from 'src/app/services/homeRefresh/home-refresh.service';

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
  submitting: boolean = false;

  constructor(
    private mediaCapture: MediaCapture,
    private sanitizer: DomSanitizer,
    private alertController: AlertController,
    private tabsService: TabsService,
    private challengeService: ChallengeService, // Inject the video upload service
    private navCtrl: NavController,
    private router: Router,
    private homeRefreshService: HomeRefreshService
  ) {}

  ngOnInit() {
    this.tabsService.hideTabs();
  }
  ngAfterViewInit() {
    this.fileInput.nativeElement.click()
  }
  ionViewWillEnter() {
    this.tabsService.hideTabs();
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

  async onFileSelected(event: Event) {
    // Hide the tab bar when the page is initialized
    this.tabsService.hideTabs();
  
    const target = event.target as HTMLInputElement;
    const file: File | null = target.files ? target.files[0] : null;
  
    if (!file) {
      this.showErrorAlert("No file selected. Please choose a video file.");
      return;
    }
  
    // Best practice: Check the file type to ensure it’s a video
    if (!file.type.startsWith("video/")) {
      this.showErrorAlert("Invalid file type. Please select a video file.");
      this.resetFileInput();
      return;
    }
  
    // Create a video element to load the metadata (such as duration)
    const videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(file);
  
    // Use a Promise to handle the loaded metadata asynchronously
    try {
      await this.loadVideoMetadata(videoElement);
  
      // Check video duration
      if (videoElement.duration > 30) {
        this.showErrorAlert("The selected video is longer than 30 seconds. Please select a shorter video.");
        this.resetFileInput();
      } else {
        // Safe URL assignment for the preview
        this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(videoElement.src);
        this.isVideoSelected = true;
        this.selectedVideoFile = file; // Store the selected video file
      }
    } catch (error) {
      this.showErrorAlert("Error loading video metadata. Please try another video file.");
      console.error(error); // Log the error for debugging purposes
    }
  }
  
  // Helper function to load video metadata asynchronously
  private loadVideoMetadata(videoElement: HTMLVideoElement): Promise<void> {
    return new Promise((resolve, reject) => {
      videoElement.onloadedmetadata = () => resolve();
      videoElement.onerror = () => reject(new Error("Failed to load video metadata."));
    });
  }

  async showErrorAlert(message: string) {
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
        this.submitting = true;
        const challengeType = 'VIDEO'; // Set your challenge type accordingly
        console.log(this.selectedVideoFile)
        this.challengeService.uploadChallenge(this.description, challengeType, this.selectedVideoFile).subscribe({
          next: async (response) => {
            const alert = await this.alertController.create({
              header: 'Success',
              message: 'Challenge Created!',
              buttons: [{
                text:'OK',
                handler: () => {
                  this.toHome();
                }
              }]
            });
        
            await alert.present();          
          },
          error: async(error) => {
            console.log(error)
            console.log(error.error)

            this.submitting = false;
            const alert = await this.alertController.create({
              header: 'Error',
              message: `Error submitting challenge. ${error.error}`,
              buttons: [{
                text:'OK',
                handler: () => {
                  this.cancel();
                }
              }]
            });
        
            await alert.present();
          }
        });

    }
  }

  cancel() {
    this.selectedVideoFile = null;
    this.videoUrl = null; // Reset the selected video
    this.description = ''; // Clear the description
    this.isVideoSelected = false; // Reset the selection state
    this.isDescriptionAdded = false; // Go back to the first step
  
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.router.navigate([`/tabs/add-video`]);
  }
  
  toHome() {
    this.selectedVideoFile = null;
    this.videoUrl = null; // Reset the selected video
    this.description = ''; // Clear the description
    this.isVideoSelected = false; // Reset the selection state
    this.isDescriptionAdded = false; // Go back to the first step
  
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }

    this.homeRefreshService.triggerRefresh();

    this.router.navigate([`/tabs/home`]);
  }
}
