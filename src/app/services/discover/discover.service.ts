import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscoverService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  getUsers(userName: string, take: number): Observable<any> {
    return this.http.get<any[]>(
      `${this.apiUrl}/Discover?userName=${userName}&take=${take}`
    );
  }
}
