import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { AlertController } from '@ionic/angular';

export const authGuard = async (): Promise<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertController = inject(AlertController);

  if(location.pathname == "/login" || location.pathname == "/register" || location.pathname == "/confirm-email")
    return true;

  if (authService.isAuthenticated()) {
    return true;
  } else {
    const alert = await alertController.create({
      header: 'Invalid Session',
      message: 'Please log in again.',
      buttons: ['OK']
    });
    await alert.present();
    
    router.navigate(['/login']);
    return false;
  }
};
