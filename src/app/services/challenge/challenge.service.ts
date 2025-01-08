import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Challenge } from '../../models/challenge.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ChallengeService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  getAllChallenges(page: number): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(
        `${this.apiUrl}/challenge?page=${page}`
    );
  }

  getChallengesCount(): Observable<number> {
    return this.http.get<number>(
        `${this.apiUrl}/challenge/Count`
    );
  }

  uploadChallenge(description: string, challengeType: string, videoFile: File): Observable<any> {
    var req = new FormData();
    req.append('description', description);
    req.append('challengeType', challengeType);
    req.append('mediaFile', videoFile); // Append the video file

    return this.http.post(`${this.apiUrl}/Challenge`, req).pipe(
      map((response: any) => {
        return response
      })
    );
  }

  
  uploadChallengeResponse(description: string, challengeGuid: string, videoFile: File, challengeType: string): Observable<any> {
    var formData = new FormData();
    formData.append('description', description);
    formData.append('challengeGuid', challengeGuid);
    formData.append('mediaFile', videoFile); // Append the video file
    formData.append('challengeType', challengeType);

    return this.http.post(`${this.apiUrl}/ChallengeResponse`, formData).pipe(
      map((response: any) => {
        return response
      })
    );
  }

  getUserChallenges(userName: string): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(
      `${this.apiUrl}/challenge/username/${userName}`
    );
  }

  getChallenge(id: number): Observable<Challenge> {
    return this.http.get<Challenge>(
      `${this.apiUrl}/challenge/Id/${id}`
    );
  }

  getUserChallengeResponses(userName: string): Observable<any> {
    console.log("reson")
    return this.http.get<Response[]>(
      `${this.apiUrl}/challengeResponse/UserName/${userName}`
    );
  }
  
  getUserChallengeResponse(guid: string): Observable<any> {
    return this.http.get<Response[]>(
      `${this.apiUrl}/challengeResponse/${guid}`
    );
  }
}
