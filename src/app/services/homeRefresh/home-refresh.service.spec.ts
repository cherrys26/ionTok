import { TestBed } from '@angular/core/testing';

import { HomeRefreshService } from './home-refresh.service';

describe('HomeRefreshService', () => {
  let service: HomeRefreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeRefreshService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
