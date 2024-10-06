import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}/TagProfile/`;

@Injectable({
  providedIn: 'root',
})
export class TagProfilesHTTPService {
  constructor(private http: HttpClient) {}

  getTagProfiles(
    token: string,
    pageNumber: number,
    search?: string
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(
      `${API_URL}GetTagsProfile?PageNumber=${pageNumber}${
        search ? '&Search=' + search : ''
      }`,
      {
        headers: httpHeaders,
      }
    );
  }
}
