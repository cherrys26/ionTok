import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AlertController, NavController } from '@ionic/angular';
import { TabsService } from '../../services/tabs/tab.service'; 
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

  constructor(
    private mediaCapture: MediaCapture,
    private sanitizer: DomSanitizer,
    private alertController: AlertController,
    private tabsService: TabsService,
    private challengeService: ChallengeService,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController // <-- Inject NavController
  ) {}

  ngOnInit() {
    this.tabsService.hideTabs();
    this.route.queryParams.subscribe(params => {
      this.challengeGuid = params['challengeGuid'];
      console.log(this.challengeGuid)
    });
  }
  ngAfterViewInit() {
    this.fileInput.nativeElement.click()
  }

  ionViewWillLeave() {
    this.tabsService.showTabs(); // Show the tab bar again when leaving the page
  }

  async onFileSelected(event: any) {
    this.tabsService.hideTabs(); // Hide the tab bar when the page is initialized

    const file: File = event.target.files[0];

    if (file) {
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);

      videoElement.onloadedmetadata = () => {
        if (videoElement.duration > 30) {
          this.showAlert();
          this.resetFileInput();
          this.tabsService.showTabs(); // Show the tab bar again when leaving the page
        } else {
          this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(videoElement.src);
          this.isVideoSelected = true;
          this.selectedVideoFile = file; // Store the selected video file
          console.log('Selected video URL:', this.videoUrl);
        }
      };
    }
  }

  async showAlert() {
    this.tabsService.showTabs(); // Show the tab bar again when leaving the page

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
      try {
        const response = await this.challengeService.uploadChallengeResponse(this.description, this.challengeGuid, this.selectedVideoFile).toPromise();
        this.tabsService.showTabs(); // Show the tab bar again when leaving the page

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
          this.tabsService.showTabs(); // Show the tab bar again when leaving the page

          const alert = await this.alertController.create({
            header: 'Error',
            message: `Error submitting response. ${error.error}`,
            buttons: ['OK']
          });
      
          await alert.present();      }
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
