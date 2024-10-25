import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'https://localhost:7282/api';
  
  constructor(private http: HttpClient) {}
  
  getComments(parentReferenceType: string, parentId: string): Observable<any> {
    return this.http.get<string[]>(
      `${this.apiUrl}/Comment?parentReferenceType=${parentReferenceType}&parentId=${parentId}`
    );
  }

  postComment(text: string, parentReference: string, parentReferenceId: string): Observable<any>{
    var formData = new FormData();
    formData.append('Text', text);
    formData.append('ParentReference', parentReference);
    formData.append('ParentReferenceId', parentReferenceId);

    return this.http.post(`${this.apiUrl}/Comment`, formData);

  }

}
