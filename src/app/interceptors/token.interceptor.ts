import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getToken();

    if (accessToken) {
      req = this.addTokenHeader(req, accessToken);
    }
return;
    // return next.handle(req).pipe(
    //   catchError(err => {
    //     if (err.status === 401) {
    //       // If token is expired, try to refresh it
    //       return this.authService.refreshToken().pipe(
    //         switchMap((newToken: any) => {
    //           this.authService.storeToken(newToken.accessToken); // Store new token
    //           req = this.addTokenHeader(req, newToken.accessToken); // Retry with the new token
    //           return next.handle(req);
    //         }),
    //         catchError(error => {
    //           this.authService.logout(); // Logout if refresh token fails
    //           return throwError(error);
    //         })
    //       );
    //     }

    //     return throwError(err);
    //   })
    // );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
