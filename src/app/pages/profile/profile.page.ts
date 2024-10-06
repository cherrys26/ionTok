import { Component, OnInit } from '@angular/core';
import { ChallengeService } from '../../services/challenge/challenge.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  challenges: any[] = [];
  responses: any[] = [];
  likes: any[] = [];
  selectedSegment: string = 'challenges'; // Track the selected segment
  loadedData: { [key: string]: boolean } = {
    challenges: false,
    responses: false,
    likes: false,
  };

  constructor(private challengeService: ChallengeService) {}

  ngOnInit() {
    this.loadData('challenges');
  }

  segmentChanged(event: any) {
    const selectedSegment = event.detail.value;
    this.selectedSegment = selectedSegment; // Update the selected segment
    this.loadData(selectedSegment);
  }

  loadData(segment: string) {
    if (!this.loadedData[segment]) {
      let apiCall;
      switch (segment) {
        case 'challenges':
          apiCall = this.challengeService.getUserChallenges('');
          break;
        case 'responses':
          apiCall = this.challengeService.getUserChallengeResponses('');
          break;
        case 'likes':
          // apiCall = this.challengeService.getUserChallengeLikes();
          break;
        default:
          console.error('Error');
          return;
      }

      apiCall.subscribe(
        (response) => {
          if (segment === 'challenges') {
            this.challenges = response;
          } else if (segment === 'responses') {
            this.responses = response;
          } else if (segment === 'likes') {
            this.likes = response;
          }
          this.loadedData[segment] = true; // Mark as loaded
        },
        (error) => {
          console.error('Error loading data:', error);
        }
      );
    }
  }
}
