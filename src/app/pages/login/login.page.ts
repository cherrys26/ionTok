import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';
  isSubmitting: boolean = false; // Variable to track submission state

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async onSubmit() {
    this.router.navigate(['/tabs/home']); // Redirect after successful login

    this.isSubmitting = true; // Set submitting state to true
    this.authService.login({ username: this.username, password: this.password }).subscribe(
      async () => {
        this.isSubmitting = false; // Reset submitting state
        this.router.navigate(['/tabs/home']); // Redirect after successful login
      },
      async (error) => {
        this.isSubmitting = false; // Reset submitting state
        const alert = await this.alertController.create({
          header: 'Login Failed',
          message: 'Invalid credentials. Please try again.',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }

  goToSignUp() {
    this.router.navigate(['/register']);
  }
}
