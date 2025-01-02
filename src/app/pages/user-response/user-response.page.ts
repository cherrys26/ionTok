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
  challengeResponses: Response[];
  guid: string = '';
  userName: string = '';
  selectedChallengeIndex: number = 0;

  constructor(
    private challengeService: ChallengeService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.selectedChallengeIndex = +params.get('index') || 0; // Get the index from route parameters
      this.userName = params.get('userName') || '';
    });
    this.loadChallengeResponse();
  }
  
    loadChallengeResponse() {
      this.challengeService.getUserChallengeResponses(this.userName).subscribe(challengeResponses => {
        this.challengeResponses = challengeResponses; 
        console.log(challengeResponses)
      });
      
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

