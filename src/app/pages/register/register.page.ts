import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service'; // Create this service for API calls
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;
  isDateModalOpen = false; // Modal state

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private router: Router,
    private fb: FormBuilder // Ensure FormBuilder is injected
  ) {
    this.initializeForm();
  }

  // Initialize form and validators
  initializeForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthday: ['', [Validators.required, this.minAgeValidator(12)]], // Min age validation
      password: ['', [Validators.required, Validators.minLength(8), this.passwordComplexityValidator]],
      confirmPassword: ['', Validators.required],
      returnUrl: `${location.origin}/confirm-email`
    });
  }

  // Min Age Validator
  minAgeValidator(minAge: number) {
    return (control: any) => {
      const birthDate = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const isMinor = age < minAge || (age === minAge && monthDiff < 0);
      return isMinor ? { minAge: true } : null;
    };
  }

  // Password Complexity Validator
  passwordComplexityValidator(control: any) {
    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase) {
      return { complexity: true };
    }
    return null;
  }

  openDatePicker() {
    this.isDateModalOpen = true; // Open the modal
  }

  closeDatePicker() {
    this.isDateModalOpen = false; // Close the modal
  }

  onDateChange(event: any) {
    this.registerForm.patchValue({ birthday: event.detail.value });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      if(this.registerForm.value.confirmPassword !== this.registerForm.value.password )
      {
        const toast = await this.toastCtrl.create({
          message: 'Passwords do no match',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
      else{
      this.authService.register(this.registerForm.value).subscribe(
        async (response) => {
          const toast = await this.toastCtrl.create({
            message: 'Registration successful! Please check your email to confirm.',
            duration: 3000,
            color: 'success'
          });
          await toast.present();
          this.navCtrl.navigateForward('/login');
        },
        async (error) => {
          let errorMessages: string[] = [];

          if (error.error) {
            // Iterate through each error and gather messages
            for (const key of Object.keys(error.error)) {
              if (Array.isArray(error.error[key])) {
                errorMessages = errorMessages.concat(error.error[key]);
              } else {
                errorMessages.push(error.error[key]);
              }
            }
          } else {
            errorMessages.push('Registration failed. Please try again.');
          }          
          const toast = await this.toastCtrl.create({
            message: `Registration failed. ${errorMessages.join(' ')}`,
            duration: 3000,
            color: 'danger'
          });
          await toast.present();
        });
    }}else {
      this.registerForm.markAllAsTouched(); // Show validation errors
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
