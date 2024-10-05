import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenInterceptor } from './token.interceptor'; // Adjust the path as necessary
import { HTTP_INTERCEPTORS, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service'; // Adjust the path as necessary
import { Observable, of } from 'rxjs';

class MockAuthService {
  getToken() {
    return 'mock-jwt-token'; // Return a mock token for testing
  }
}

describe('TokenInterceptor', () => {
  let interceptor: TokenInterceptor;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    interceptor = TestBed.inject(TokenInterceptor);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should add an Authorization header if token is present', () => {
    const mockRequest = new HttpRequest('GET', '/api/test'); // Create a valid HttpRequest

    // Call the interceptor's intercept method
    interceptor.intercept(mockRequest, {
      handle: (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        return of({} as HttpEvent<any>); // Return a mock HTTP event
      }
    }).subscribe(); // Subscribe to the observable to trigger the interceptor

    const testRequest = httpMock.expectOne('/api/test'); // Replace with your API endpoint
    expect(testRequest.request.headers.has('Authorization')).toBeTrue();
    expect(testRequest.request.headers.get('Authorization')).toBe('Bearer mock-jwt-token'); // Optional: Check the token value
  });

  it('should pass the request if no token is present', () => {
    spyOn(authService, 'getToken').and.returnValue(null); // Simulate no token
    const mockRequest = new HttpRequest('GET', '/api/test'); // Create a valid HttpRequest

    interceptor.intercept(mockRequest, {
      handle: (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        return of({} as HttpEvent<any>); // Return a mock HTTP event
      }
    }).subscribe(); // Subscribe to trigger the interceptor

    const testRequest = httpMock.expectOne('/api/test'); // Replace with your API endpoint
    expect(testRequest.request.headers.has('Authorization')).toBeFalse();
  });
});
