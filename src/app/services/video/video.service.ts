import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

import { Video } from '../../models/video.model';
import { Response } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})

export class VideoService {
  private apiUrl = 'https://localhost:7282/api'; // Replace with your API endpoint

  private startIndex = 0;
  private chunkSize = 3;
  
  constructor(private http: HttpClient, private dataService: DataService) {}

  getVideos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getVideoListFromApi(pageNumber: number, pageSize: number): Observable<Video[]> {
    return this.http.get<Video[]>(
        `${this.apiUrl}/video?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getVideoResponseList(videoId: number, pageNumber: number, pageSize: number): Observable<Video[]> {
    return this.http.get<Video[]>(
        `${this.apiUrl}/video/${videoId}/pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getStaticVideoList(): Observable<Video[]> {
    return this.dataService.getVideoList(this.startIndex, this.chunkSize);
  }
  
  getStaticVideos(): Observable<Video[]> {
    return this.dataService.getStaticVideos();
  }

  loadMoreVideos(): Observable<Video[]> {
    this.startIndex += this.chunkSize;
    return this.dataService.getVideoList(this.startIndex, this.chunkSize);
  }

  getResponsesForVideo(videoId: number): Observable<Response[]> {
    const filteredResponses = this.dataService.getVideoResponses(videoId)
    return filteredResponses;
  }


  getPictures(): Observable<Video[]> {
    return this.http.get<Video[]>(this.apiUrl);
  }

  getRelatedPictures(pictureId: string): Observable<Video[]> {
    // Replace with the actual endpoint for fetching related pictures
    return this.http.get<Video[]>(`${this.apiUrl}/${pictureId}/related`);
  }
}
