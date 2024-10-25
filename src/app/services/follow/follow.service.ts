import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private apiUrl = 'https://localhost:7282/api';
  
  constructor(private http: HttpClient) {}
  
  IsFollowing(userName: string): Observable<any> {
    return this.http.get<string[]>(
      `${this.apiUrl}/Follow/IsFollowing/${userName}`
    );
  }
  
  GetFollowingCount(userName: string): Observable<any> {
    return this.http.get<string[]>(
      `${this.apiUrl}/Follow/FollowingCount/${userName}`
    );
  }  

  GetFollowersCount(userName: string): Observable<any> {
    return this.http.get<string[]>(
      `${this.apiUrl}/Follow/FollowersCount/${userName}`
    );
  }

  postFollow(userName: string): Observable<any>{
    return this.http.post(`${this.apiUrl}/Follow/Toggle-Follow/${userName}`, "", { responseType: 'text' }).pipe(
      map((response: any) => {
        return response
      })
    )
  }
  
  GetFollowers(userName: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/Follow/Followers/${userName}`);
  }
  
  GetFollowing(userName: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/Follow/Following/${userName}`);
  }
}
