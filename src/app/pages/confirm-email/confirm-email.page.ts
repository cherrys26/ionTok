import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.page.html',
  styleUrls: ['./confirm-email.page.scss'],
})
export class ConfirmEmailPage implements OnInit {
  userId: string = '';
  code: string = '';
  constructor(
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private alertController: AlertController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      this.code = params['code'];
    });

    this.authService.confirmEmail({ userId: this.userId, code: this.code }).subscribe(
      async () => {
        const alert = await this.alertController.create({
          header: 'Success!',
          message: 'Thank you for joining',
          buttons: [{
            text:'OK',
            handler: () => {
              this.router.navigate(['/login']);
            }
        }]
        });
        await alert.present();
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Failed to confirm email.',
          message: 'Please try again.',
          buttons: [{
            text:'OK',
            handler: () => {
              this.router.navigate(['/login']);
            }
        }]
        });
        await alert.present();
      }
    );
  }

}
