import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FollowsPage } from './follows.page';

describe('FollowsPage', () => {
  let component: FollowsPage;
  let fixture: ComponentFixture<FollowsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
