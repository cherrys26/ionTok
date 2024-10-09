import { Component, OnInit } from '@angular/core';
import { ChallengeService } from '../../services/challenge/challenge.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserProfile } from 'src/app/models/userProfile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userProfile: UserProfile = {
    firstName: '',
    lastName: '',
    birthday: '',
    userName: '',
    email: '',
    id: '',
    created: '',
    isLoggedInUser: false,
    imageUrl: '',
    get profileImageUrl(): string {
      return this.imageUrl ? this.imageUrl : 'https://ionicframework.com/docs/img/demos/avatar.svg';
    }
  };
  challenges: any[] = [];
  responses: any[] = [];
  likes: any[] = [];
  selectedSegment: string = 'challenges'; // Track the selected segment
  loadedData: { [key: string]: boolean } = {
    challenges: false,
    responses: false,
    likes: false,
  };

  constructor(private challengeService: ChallengeService, private authService: AuthService) {}

  ngOnInit() {
    this.getUser();
    this.loadData('challenges');
  }

  getUser() {
    this.authService.getUser("").subscribe(
      (response) => {
        this.userProfile = response; // Store the response in the variable
        if(this.userProfile.imageUrl == '' || this.userProfile.imageUrl)
        console.log(this.userProfile)
      },
      (error) => {
        console.log(error);
      }
    )
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
