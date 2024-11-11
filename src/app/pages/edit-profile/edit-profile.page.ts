import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavController, ToastController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  userProfile = { imageUrl: '', userName: 'username' };
  selectedImageFile: File | null = null;  // Store the file
  selectedImagePreview: SafeUrl | null = null;  // Safe URL for preview
  isPreviewOpen = false;

  profileForm: FormGroup;
  isDateModalOpen = false; // Modal state

  isSubmitting: boolean = false;

  constructor(
    private profileService: ProfileService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private router: Router,
    private navCtrl: NavController
  ) {
    this.initializeForm();
  }
  
  initializeForm() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthday: ['', [Validators.required, this.minAgeValidator(12)]], // Min age validation
      description: [null],
      websiteUrl: [null]
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

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.profileService.getLoggedInUser().subscribe({
      next: (user) => {
        this.userProfile = user;
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          birthday: user.birthday,
          description: user.description,
          websiteUrl: user.websiteUrl
        });
        console.log('User profile loaded:', user);
      },
      error: (err) => console.error('Failed to load user profile:', err),
    });
  }

  async openActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Update Profile Picture',
      buttons: [
        {
          text: 'Choose from Files',
          icon: 'image-outline',
          handler: () => document.getElementById('file-input')?.click(),  // Trigger file input
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
        },
      ],
    });
    await actionSheet.present();
  }

  async captureImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: source,
    });

    if (image?.path) {
      const response = await fetch(image.webPath!);
      const blob = await response.blob();
      this.selectedImageFile = new File([blob], 'profile-image.jpg', { type: blob.type });

      // Generate a preview URL
      this.selectedImagePreview = URL.createObjectURL(this.selectedImageFile);
      this.isPreviewOpen = true;
    }
  }

  async onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = target.files ? target.files[0] : null;

    if (file) {
      const imageElement = document.createElement('img');
      imageElement.src = URL.createObjectURL(file);

      imageElement.onload = () => {
        this.selectedImagePreview = this.sanitizer.bypassSecurityTrustUrl(imageElement.src);
        this.selectedImageFile = file;
        this.isPreviewOpen = true;
      };
    }
  }

  saveProfileImage() {
    if (this.selectedImageFile) {

      console.log("test")
      this.profileService.updateProfileImage(this.selectedImageFile).subscribe({
        next: () => {
          this.getProfile();
        },
        error: (err) => console.error('Failed to update profile image:', err),
      });

      this.selectedImageFile = null;
      this.selectedImagePreview = null;
      this.isPreviewOpen = false;
    }
  }

  cancel() {
    this.selectedImageFile = null;
    this.selectedImagePreview = null;
    this.isPreviewOpen = false;
  }
  
  openDatePicker() {
    this.isDateModalOpen = true; // Open the modal
  }

  closeDatePicker() {
    this.isDateModalOpen = false; // Close the modal
  }

  onDateChange(event: any) {
    this.profileForm.patchValue({ birthday: event.detail.value });
  }

  async onSubmit() {
    this.isSubmitting = true; // Set submitting state

    if (this.profileForm.valid) {
        const formData = new FormData();
        formData.append('firstName', this.profileForm.value.firstName);
        formData.append('lastName', this.profileForm.value.lastName);
        formData.append('birthday', this.profileForm.value.birthday);
        formData.append('description', this.profileForm.value.description);
        formData.append('websiteUrl', this.profileForm.value.websiteUrl);

      this.profileService.postEdit(formData).subscribe({
        next: async (response) => {
          const toast = await this.toastCtrl.create({
            message: 'Successfully updated.',
            duration: 3000,
            color: 'success'
          });
          await toast.present();
          
          this.router.navigate([`/profile/${response.userName}`]);

          this.profileForm.reset();

          this.isSubmitting = false;
        },
        error: async (error) => 
          {
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
            } 
                    
            const toast = await this.toastCtrl.create({
              message: `Error updating. ${errorMessages.join(' ')}`,
              duration: 3000,
              color: 'danger'
            });
            await toast.present();
            this.isSubmitting = false; // Reset submitting state in case of error
  
          },
      })
    }
    else {
      this.profileForm.markAllAsTouched(); // Show validation errors
      this.isSubmitting = false; // Reset submitting state in case of error
    }  
  }

  goBack(){
    this.navCtrl.back();
  }
}
