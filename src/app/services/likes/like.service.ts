import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  getLikes(): Observable<any> {
    return this.http.get<string[]>(
      `${this.apiUrl}/Like`
    );
  }

  postLike(guid: string, parentType: string): Observable<any>{
    console.log(guid)
    var formData = new FormData();
    formData.append('ParentId', guid);
    formData.append('ParentType', parentType);

    return this.http.post(`${this.apiUrl}/Like/toggle-like`, formData);

  }

}
