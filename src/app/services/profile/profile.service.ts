import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;
  private baseApiUrl = environment.baseApiUrl;
  
  constructor(private http: HttpClient) {}
  
  getUser(userName : string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Profile/${userName}`)
  }
      
  getLoggedInUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Profile`)
  }

  getEdit(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Profile`)
  }

  updateProfileImage(profileImage: File): Observable<any>{
    const formData = new FormData();
    formData.append('imageFile', profileImage);

      return this.http.post(`${this.baseApiUrl}/Identity/UpdateProfileImage`, formData).pipe(
        map((response: any) => {
          return response
        })
      );
  }

  postEdit(formData: FormData): Observable<any>{
    return this.http.post(`${this.baseApiUrl}/Identity/EditProfile`, formData).pipe(
      map((response: any) => {
        return response
      })
    )
  }
}
