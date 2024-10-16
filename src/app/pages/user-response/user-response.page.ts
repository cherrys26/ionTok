import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Response } from 'src/app/models/response.model';
import { ChallengeService } from 'src/app/services/challenge/challenge.service';

@Component({
  selector: 'app-user-response',
  templateUrl: './user-response.page.html',
  styleUrls: ['./user-response.page.scss'],
})
export class UserResponsePage implements OnInit {
  challengeResponse: Response = {} as Response;
  challenge: Response = {} as Response;
  guid: string = '';

  constructor(
    private challengeService: ChallengeService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.guid = params.get('guid')
      this.loadChallengeResponse();
    });
  }
  
    loadChallengeResponse() {
      this.challengeService.getUserChallengeResponse(this.guid).subscribe(challengeResponse => {
        this.challengeResponse = challengeResponse; 
      });
    }

    goBack() {
      this.navCtrl.back(); // Navigate back in history
    }

    GoToChallenge(challengeId: number){
      this.router.navigate([`/view-challenge/${challengeId}`])
    }
}

