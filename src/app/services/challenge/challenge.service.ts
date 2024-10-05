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
}
