import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseApiUrl = 'https://localhost:7282'; // Replace with your API URL

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  register(registerRequest: any): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/Identity/Register`, registerRequest).pipe(
      map((response: any) => {
        console.log(response)
      })
    );
  }

  confirmEmail(model: {userId: string, code: string}): Observable<any>{
    return this.http.post(`${this.baseApiUrl}/Identity/ConfirmEmail?userId=${model.userId}&code=${model.code}`, null).pipe(
      map((response: any) => {
        console.log(response)
      })
    );
  }

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/Identity/Token`, credentials).pipe(
      map((response: any) => {
        if (response && response.token) {
          localStorage.setItem('jwtToken', response.token);
        }
        return response;
      })
    );
  }
  
  storeToken(token: string) {
    localStorage.setItem('jwtToken', token);
  }
  
  isAuthenticated(): boolean {
    const token = localStorage.getItem('jwtToken');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  logout() {
    localStorage.removeItem('jwtToken');
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  getUser(userId : string): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/Identity/GetUser?userId=${userId}`)
  }
}