import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserChallengeFeedComponent } from './user-challenge-feed.component';

describe('UserChallengeFeedComponent', () => {
  let component: UserChallengeFeedComponent;
  let fixture: ComponentFixture<UserChallengeFeedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserChallengeFeedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserChallengeFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
