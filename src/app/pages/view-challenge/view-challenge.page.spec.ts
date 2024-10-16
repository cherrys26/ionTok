import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewChallengePage } from './view-challenge.page';

describe('ViewChallengePage', () => {
  let component: ViewChallengePage;
  let fixture: ComponentFixture<ViewChallengePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChallengePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
