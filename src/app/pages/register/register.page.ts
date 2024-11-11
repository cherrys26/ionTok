import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service'; // Create this service for API calls
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  registerForm: FormGroup;
  isDateModalOpen = false; // Modal state
  isSubmitting = false; // New variable to track submission state

  imageUrlTest: SafeUrl | null = null;
  selectedImageFile: File | null = null;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private router: Router,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
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
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?\\d{1,3}?[-.\\s]?\\(?\\d{1,4}?\\)?[-.\\s]?\\d{3,4}[-.\\s]?\\d{3,4}$')]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordComplexityValidator]],
      confirmPassword: ['', Validators.required],
      imageUrl: [''],
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
  
  async onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement; // Type assertion
    const file: File = target.files[0];

    if (file) {
      const imageElement = document.createElement('img');
      imageElement.src = URL.createObjectURL(file);

      imageElement.onload = () => {
        this.imageUrlTest = this.sanitizer.bypassSecurityTrustUrl(imageElement.src); // Sanitize the image URL
        this.selectedImageFile = file; // Store the selected image file
      };
    }
  }

  async onSubmit() {
    this.isSubmitting = true; // Set submitting state

    if (this.registerForm.valid) {
      if(this.registerForm.value.confirmPassword !== this.registerForm.value.password )
      {
        const toast = await this.toastCtrl.create({
          message: 'Passwords do no match',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
        this.isSubmitting = false; // Reset submitting state
      }
      else{
        const formData = new FormData();
        formData.append('username', this.registerForm.value.username);
        formData.append('email', this.registerForm.value.email);
        formData.append('firstName', this.registerForm.value.firstName);
        formData.append('lastName', this.registerForm.value.lastName);
        formData.append('birthday', this.registerForm.value.birthday);
        formData.append('phoneNumber', this.registerForm.value.phoneNumber);
        formData.append('password', this.registerForm.value.password);
        formData.append('confirmPassword', this.registerForm.value.confirmPassword);
        formData.append('returnUrl', this.registerForm.value.returnUrl);

        if (this.selectedImageFile) {
          formData.append('imageFile', this.selectedImageFile); // Append file to FormData
        }

      this.authService.register(formData).subscribe(
        async (response) => {
          const toast = await this.toastCtrl.create({
            message: 'Registration successful! Please check your email to confirm.',
            duration: 3000,
            color: 'success'
          });
          await toast.present();
          this.navCtrl.navigateForward('/login');
          this.registerForm.reset();
          this.selectedImageFile = null;
          this.isSubmitting = false;
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
          this.isSubmitting = false; // Reset submitting state in case of error
        });
    }}else {
      this.registerForm.markAllAsTouched(); // Show validation errors
      this.isSubmitting = false; // Reset submitting state in case of error
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
