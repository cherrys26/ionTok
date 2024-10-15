import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserChallengePage } from './user-challenge.page';

describe('UserChallengePage', () => {
  let component: UserChallengePage;
  let fixture: ComponentFixture<UserChallengePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserChallengePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
