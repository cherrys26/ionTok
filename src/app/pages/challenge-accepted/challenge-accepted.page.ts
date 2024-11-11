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
  videoUrl: SafeUrl | null = null;
  description: string = '';
  isVideoSelected: boolean = false;
  isDescriptionAdded: boolean = false;
  selectedVideoFile: File | null = null; // Store the selected video file
  challengeGuid: string;
  submitting: boolean = false;

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

    if (file) {
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);

      const fileSizeMB = file.size / (1024 * 1024); // Convert file size from bytes to MB

      if (fileSizeMB > 27) { // Check if file size exceeds 27MB
        this.showErrorAlert('The selected video is too large. Please select a video less than 27MB.');
      }
      else {
        videoElement.onloadedmetadata = () => {
          if (videoElement.duration > 31) {
            this.showErrorAlert("The selected video is longer than 30 seconds. Please select a shorter video.");
            this.resetFileInput();
          } else {
            this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(videoElement.src);
            this.isVideoSelected = true;
            this.selectedVideoFile = file; // Store the selected video file
          }
        };
      }
    }
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
      this.isDescriptionAdded = true;
  }

  goBackToEdit() {
    this.isDescriptionAdded = false;
  }

  async submit() {
    if (this.selectedVideoFile) {
      this.submitting = true;

        this.challengeService.uploadChallengeResponse(this.description, this.challengeGuid, this.selectedVideoFile).subscribe({
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
