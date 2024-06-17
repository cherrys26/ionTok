import {Component} from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {
    isIconChange: boolean = false;
    isNotHome: boolean = false;

    constructor(
        private actionSheetController: ActionSheetController, 
        private camera: Camera,
        private router: Router
      ) {}
    
    tabClicked(e) {
        e.tab !== 'home' ? this.isIconChange = true : this.isIconChange = false;
        e.tab !== 'home' ? this.isNotHome = true : this.isNotHome = false;
    }

    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
          header: 'Select Video Source',
          buttons: [
            {
              text: 'Take Video',
              icon: 'videocam',
              handler: () => this.captureVideo(this.camera.PictureSourceType.CAMERA)
            },
            {
              text: 'Choose from Gallery',
              icon: 'image',
              handler: () => this.captureVideo(this.camera.PictureSourceType.SAVEDPHOTOALBUM) 
            },
            {
              text: 'Cancel',
              icon: 'close',
              role: 'cancel'
            }
          ]
        });
        await actionSheet.present();
      }

      async captureVideo(sourceType: number) {
        const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.FILE_URI,
          sourceType: sourceType,
          mediaType: this.camera.MediaType.VIDEO, 
        };
    
        try {
          const videoUrl = await this.camera.getPicture(options);
          this.router.navigate(['/add-view'], { queryParams: { videoUrl: videoUrl } });
        } catch (error) {
          console.error('Error capturing video:', error);
          // Handle errors appropriately (e.g., show a toast message)
        }
      }
}
