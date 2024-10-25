import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FollowService } from 'src/app/services/follow/follow.service';

@Component({
  selector: 'app-follows',
  templateUrl: './follows.page.html',
  styleUrls: ['./follows.page.scss'],
})
export class FollowsPage implements OnInit {
  selectedSegment: string = 'followers'; // Default segment
  followers: any[] = [];
  following: any[] = [];
  userName: string = "";
  loadedData: { [key: string]: boolean } = { followers: false, following: false };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private followService: FollowService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.selectedSegment = params.get('selectedSegment') || "followers";
      this.userName = params.get('userName');
      this.loadData(this.selectedSegment);

    })
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    if(!this.loadedData[this.selectedSegment])
      this.loadData(this.selectedSegment);
  }

  loadData(segment: string) {
    this.loadedData[segment] = true;

    if (segment === 'followers') {
      this.loadFollowers();
    } else {
      this.loadFollowing();
    }
  }

  loadFollowers() {
    this.followService.GetFollowers(this.userName).subscribe(f => {
      this.followers = f;
    })
  }

  loadFollowing() {
    this.followService.GetFollowing(this.userName).subscribe(f => {
      this.following = f;
    })
  }

  goToProfile(userName: string) {
    this.router.navigate([`/tabs/profile/${userName}`]);
  }

  goBack() {
    this.navCtrl.back();
  }
}
