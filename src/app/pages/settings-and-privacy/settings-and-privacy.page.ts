import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; // Import AlertController

@Component({
  selector: 'app-settings-and-privacy',
  templateUrl: './settings-and-privacy.page.html',
  styleUrls: ['./settings-and-privacy.page.scss'],
})
export class SettingsAndPrivacyPage {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController // Inject AlertController
  ) {}

  async presentLogoutAlert() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // Action on cancel, do nothing
            console.log('Logout canceled');
          },
        },
        {
          text: 'Confirm',
          handler: () => {
            this.logout(); // Call the logout method if confirmed
          },
        },
      ],
    });

    await alert.present();
  }

  logout() {
    this.authService.logout(); // Call the logout method from AuthService
    this.router.navigate(['/login']); // Navigate to the login page after logout
  }
}
