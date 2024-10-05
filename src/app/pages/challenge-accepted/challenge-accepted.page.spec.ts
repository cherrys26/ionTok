import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChallengeAcceptedPage } from './challenge-accepted.page';

describe('ChallengeAcceptedPage', () => {
  let component: ChallengeAcceptedPage;
  let fixture: ComponentFixture<ChallengeAcceptedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeAcceptedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
