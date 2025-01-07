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
  mediaUrl: SafeUrl | null = null; // Supports both video and picture
  description: string = '';
  isMediaSelected: boolean = false;
  isDescriptionAdded: boolean = false;
  selectedMediaFile: File | null = null; // Store the selected media file
  mediaType: 'VIDEO' | 'IMAGE' | null = null; // Media type to differentiate
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
    this.fileInput.nativeElement.click();
  }

  ionViewWillEnter() {
    this.tabsService.hideTabs();
  }
  ionViewWillLeave() {
    this.tabsService.showTabs(); // Show the tab bar again when leaving the page
  }

async onFileSelected(event: Event) {
  this.tabsService.hideTabs();

  const target = event.target as HTMLInputElement;
  const file: File | null = target.files ? target.files[0] : null;

  if (!file) {
    this.showErrorAlert('No file selected. Please choose a file.');
    return;
  }

  // Determine file type
  if (file.type.startsWith('video/')) {
    this.mediaType = 'VIDEO';
  } else if (file.type.startsWith('image/')) {
    this.mediaType = 'IMAGE';
  } else {
    this.showErrorAlert('Invalid file type. Please select a video or image file.');
    this.resetFileInput();
    return;
  }

  const fileUrl = URL.createObjectURL(file);

  if (this.mediaType === 'VIDEO') {
    // Handle video validation
    const videoElement = document.createElement('video');
    videoElement.src = fileUrl;

    try {
      await this.loadMediaMetadata(videoElement);

      if (videoElement.duration > 30) {
        this.showErrorAlert('The selected video is longer than 30 seconds. Please select a shorter video.');
        this.resetFileInput();
      } else {
        this.mediaUrl = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
        this.isMediaSelected = true;
        this.selectedMediaFile = file;
      }
    } catch (error) {
      this.showErrorAlert('Error loading video metadata. Please try another file.');
    }
  } else if (this.mediaType === 'IMAGE') {
    // Handle image preview
    this.mediaUrl = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
    this.isMediaSelected = true;
    this.selectedMediaFile = file;
  }
}  
  // Helper function to load video metadata asynchronously
  private loadMediaMetadata(videoElement: HTMLVideoElement): Promise<void> {
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
    this.mediaUrl = null;
    this.isMediaSelected = false;
    this.selectedMediaFile = null;
    this.mediaType = null;
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
    if (this.selectedMediaFile) {
      this.submitting = true;
  
      try {
        this.challengeService
          .uploadChallenge(this.description, this.mediaType, this.selectedMediaFile)
          .subscribe({
            next: async () => {
              const alert = await this.alertController.create({
                header: 'Success',
                message: 'Challenge Created!',
                buttons: [
                  {
                    text: 'OK',
                    handler: () => {
                      this.toHome();
                    },
                  },
                ],
              });
  
              await alert.present();
            },
            error: async (error) => {
              console.error(error);
              this.submitting = false;
  
              const alert = await this.alertController.create({
                header: 'Error',
                message: `Error submitting challenge. ${error.error}`,
                buttons: [
                  {
                    text: 'OK',
                    handler: () => {
                      this.cancel();
                    },
                  },
                ],
              });
  
              await alert.present();
            },
          });
      } catch (error) {
        this.showErrorAlert('Failed to submit the challenge. Please try again.');
      }
    }
  }
  
  cancel() {
    this.selectedMediaFile = null;
    this.mediaUrl = null; // Reset the selected video
    this.description = ''; // Clear the description
    this.isMediaSelected = false; // Reset the selection state
    this.isDescriptionAdded = false; // Go back to the first step
  
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.router.navigate([`/tabs/add-video`]);
  }
  
  toHome() {
    this.selectedMediaFile = null;
    this.mediaUrl = null; // Reset the selected video
    this.description = ''; // Clear the description
    this.isMediaSelected = false; // Reset the selection state
    this.isDescriptionAdded = false; // Go back to the first step
  
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }

    this.homeRefreshService.triggerRefresh();

    this.router.navigate([`/tabs/home`]);
  }
}
