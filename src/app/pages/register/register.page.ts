import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service'; // Create this service for API calls
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  registerRequest = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    birthday: '',
    password: '',
    confirmPassword: '',
    returnUrl: `${location.origin}/Confirm-email`
  };
  currentUrl: string;
  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private router: Router) {
  }

  onDateChange(event: any) {
    this.registerRequest.birthday = event.detail.value;
  }

  async onSubmit() {
      console.log('Current URL:', this.router);
      this.authService.register(this.registerRequest).subscribe(
        async (response) => {
          console.log(response)
          const toast = await this.toastCtrl.create({
            message: 'Registration successful! Please check your email to confirm.',
            duration: 3000,
            color: 'success'
          });
          await toast.present();
          this.navCtrl.navigateForward('/login');
      },
      async (error) => {
        console.log(error)
        const toast = await this.toastCtrl.create({
          message: 'Registration failed. Please try again.',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
        });
  }
}
