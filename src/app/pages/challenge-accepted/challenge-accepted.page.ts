import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AlertController, NavController } from '@ionic/angular';
import { ChallengeService } from '../../services/challenge/challenge.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-challenge-accepted',
  templateUrl: './challenge-accepted.page.html',
  styleUrls: ['./challenge-accepted.page.scss'],
  providers: [MediaCapture]
})
export class ChallengeAcceptedPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  mediaUrl: SafeUrl | null = null;
  description: string = '';
  isMediaSelected: boolean = false;
  isDescriptionAdded: boolean = false;
  selectedMediaFile: File | null = null; // Store the selected media file
  isVideo: boolean = false; // Determine if the selected media is a video
  challengeGuid: string;
  submitting: boolean = false;
  mediaType: 'VIDEO' | 'IMAGE' | null = null; // Media type to differentiate

  constructor(
    private sanitizer: DomSanitizer,
    private alertController: AlertController,
    private challengeService: ChallengeService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.challengeGuid = params['challengeGuid'];
    });
  }

  ngAfterViewInit() {
    this.fileInput.nativeElement.click()
  }

  async onFileSelected(event: any) {
    const target = event.target as HTMLInputElement;
    const file: File = target.files ? target.files[0] : null;

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
      this.isDescriptionAdded = true;
  }

  goBackToEdit() {
    this.isDescriptionAdded = false;
  }

  async submit() {
    if (this.selectedMediaFile) {
      this.submitting = true;

        this.challengeService.uploadChallengeResponse(this.description, this.challengeGuid, this.selectedMediaFile, this.mediaType).subscribe({
          next: async (response) =>{
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
          },
          error: async (err) => {
            this.submitting = false;

            const alert = await this.alertController.create({
              header: 'Error',
              message: `Error submitting response. ${err.error}`,
              buttons: [{
                text:'OK',
                handler: () => {
                  this.cancel();
                }
              }]
            });
        
            await alert.present();      
          }
        }
        );
    }
  }

  cancel() {
    this.challengeGuid = null;
    this.selectedMediaFile = null;
    this.mediaUrl = null; // Reset the selected video
    this.description = ''; // Clear the description
    this.isMediaSelected = false; // Reset the selection state
    this.isDescriptionAdded = false; // Go back to the first step
  
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }

    this.navCtrl.back();
  }
}
