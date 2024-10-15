import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserResponsePage } from './user-response.page';

describe('UserResponsePage', () => {
  let component: UserResponsePage;
  let fixture: ComponentFixture<UserResponsePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserResponsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
