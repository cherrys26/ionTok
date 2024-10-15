import { Component, OnInit } from '@angular/core';
import { ChallengeService } from '../../services/challenge/challenge.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserProfile } from 'src/app/models/userProfile.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userName: string;
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
  selectedSegment: string = 'challenges';
  segmentLoading: boolean = false; // Track loading state for each segment
  isLoading: boolean = true; // Track overall page loading state
  loadedData: { [key: string]: boolean } = { challenges: false, responses: false, likes: false };

  constructor(
    private challengeService: ChallengeService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.userName = this.route.snapshot.paramMap.get('userName');
    this.getUser(this.userName);
    this.loadData('challenges'); // Load challenges by default
  }

  getUser(userName: string) {
    this.authService.getUser(userName).subscribe(
      (response) => {
        this.userProfile = response;
        this.isLoading = false; // Stop full-page loading after user data is loaded
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  segmentChanged(event: any) {
    const selectedSegment = event.detail.value;
    this.selectedSegment = selectedSegment;
    this.loadData(selectedSegment);
  }

  loadData(segment: string) {
    if (!this.loadedData[segment]) {
      this.segmentLoading = true; // Show loading spinner for the segment
      let apiCall;

      switch (segment) {
        case 'challenges':
          apiCall = this.challengeService.getUserChallenges(this.userName);
          break;
        case 'responses':
          apiCall = this.challengeService.getUserChallengeResponses(this.userName);
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
          if (segment === 'challenges') this.challenges = response;
          if (segment === 'responses') this.responses = response;
          if (segment === 'likes') this.likes = response;

          this.loadedData[segment] = true;
          this.segmentLoading = false; // Hide segment loading spinner
        },
        (error) => {
          console.error('Error loading data:', error);
          this.segmentLoading = false;
        }
      );
    }
  }

  onChallengeClick(index: number) {
    this.router.navigate([`/user-challenge/${this.userName}/${index}`]);
  }

  onResponseClick(guid: string){
    this.router.navigate([`/user-response/${guid}`]);

  }
}
