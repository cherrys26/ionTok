import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Challenge } from '../../models/challenge.model';

@Injectable({
  providedIn: 'root'
})

export class ChallengeService {
  private apiUrl = 'https://localhost:7282/api';
  
  constructor(private http: HttpClient) {}

  getAllChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(
        `${this.apiUrl}/challenge`
    );
  }

  uploadChallenge(description: string, challengeType: string, videoFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('challengeType', challengeType);
    formData.append('videoFile', videoFile); // Append the video file

    return this.http.post(`${this.apiUrl}/Challenge`, formData);
  }

  uploadChallengeResponse(description: string, challengeGuid: string, videoFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('challengeGuid', challengeGuid);
    formData.append('videoFile', videoFile); // Append the video file

    return this.http.post(`${this.apiUrl}/ChallengeResponse`, formData);
  }

  getUserChallenges(userId: string): Observable<any> {
    return this.http.get<Challenge[]>(
      `${this.apiUrl}/challenge/userId?userId=${userId}`
    );
  }

  getUserChallengeResponses(userId: string): Observable<any> {
    return this.http.get<Response[]>(
      `${this.apiUrl}/challengeResponse/userId?userId=${userId}`
    );
  }
}
